package com.agrimarketplace.modules.rag.service;

import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.product.dto.ProductResponse;
import com.agrimarketplace.modules.rag.dto.*;
import com.agrimarketplace.modules.rag.entity.RagDocument;
import com.agrimarketplace.modules.rag.entity.RagDocumentChunk;
import com.agrimarketplace.modules.rag.repository.RagDocumentChunkRepository;
import com.agrimarketplace.modules.rag.repository.RagDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    private final RagDocumentRepository documentRepository;
    private final RagDocumentChunkRepository chunkRepository;
    private final VectorEmbeddingService vectorEmbeddingService;
    private final MarketplaceContextRetriever marketplaceContextRetriever;
    private final LlmService llmService;

    private static final int CHUNK_SIZE = 550;
    private static final int CHUNK_OVERLAP = 80;

    /**
     * Initializes knowledge base embeddings on startup if any documents lack chunks.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeKnowledgeEmbeddings() {
        log.info("Checking RAG Knowledge Base index status...");
        List<RagDocument> documents = documentRepository.findAll();
        for (RagDocument doc : documents) {
            List<RagDocumentChunk> existingChunks = chunkRepository.findByDocumentIdOrderByChunkIndexAsc(doc.getId());
            if (existingChunks.isEmpty()) {
                log.info("Indexing and embedding RAG document: '{}' (ID: {})", doc.getTitle(), doc.getId());
                indexDocument(doc);
            }
        }
        log.info("RAG Knowledge Base verification complete. Total documents: {}", documents.size());
    }

    /**
     * Chunks a document and stores embeddings.
     */
    @Transactional
    public void indexDocument(RagDocument doc) {
        chunkRepository.deleteByDocumentId(doc.getId());

        List<String> chunks = vectorEmbeddingService.chunkText(doc.getContent(), CHUNK_SIZE, CHUNK_OVERLAP);
        if (chunks.isEmpty() && doc.getSummary() != null) {
            chunks = List.of(doc.getSummary());
        }

        List<RagDocumentChunk> chunkEntities = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            String text = chunks.get(i);
            double[] vector = vectorEmbeddingService.computeEmbedding(text);
            String vectorStr = vectorEmbeddingService.vectorToString(vector);

            RagDocumentChunk chunkEntity = RagDocumentChunk.builder()
                    .document(doc)
                    .chunkIndex(i)
                    .chunkText(text)
                    .embeddingVector(vectorStr)
                    .tokenCount(text.split("\\s+").length)
                    .build();

            chunkEntities.add(chunkEntity);
        }

        chunkRepository.saveAll(chunkEntities);
    }

    /**
     * Main RAG Chat query endpoint.
     */
    @Transactional(readOnly = true)
    public RagChatResponse askCopilot(RagChatRequest request) {
        long startTime = System.currentTimeMillis();

        String query = request.getQuery().trim();
        int topK = request.getTopK() != null && request.getTopK() > 0 ? request.getTopK() : 4;

        // 1. Retrieve knowledge citations via vector + hybrid search
        List<RagCitationDto> citations = retrieveRelevantChunks(query, request.getCategoryFilter(), topK);

        // 2. Retrieve live active marketplace products if requested
        List<ProductResponse> matchedProducts = Collections.emptyList();
        if (Boolean.TRUE.equals(request.getIncludeMarketProducts())) {
            matchedProducts = marketplaceContextRetriever.retrieveMatchingProducts(query, 3);
        }

        // 3. Format conversational context
        String historyContext = formatConversationHistory(request.getConversationHistory());

        // 4. Generate grounded response
        LlmService.GenerationResult result = llmService.generateResponse(
                query, citations, matchedProducts, historyContext
        );

        long processingTime = System.currentTimeMillis() - startTime;

        return RagChatResponse.builder()
                .query(query)
                .answer(result.answer())
                .modelUsed(result.modelUsed())
                .processingTimeMs(processingTime)
                .citations(citations)
                .matchedProducts(matchedProducts)
                .suggestedFollowUps(result.followUps())
                .build();
    }

    /**
     * Semantic and keyword hybrid search across knowledge base and active marketplace listings.
     */
    @Transactional(readOnly = true)
    public RagSearchResponse search(RagSearchRequest request) {
        long startTime = System.currentTimeMillis();
        String query = request.getQuery().trim();
        int limit = request.getLimit() != null && request.getLimit() > 0 ? request.getLimit() : 5;

        List<RagCitationDto> citations = retrieveRelevantChunks(query, request.getCategory(), limit);
        List<ProductResponse> products = marketplaceContextRetriever.retrieveMatchingProducts(query, limit);

        long searchTime = System.currentTimeMillis() - startTime;

        return RagSearchResponse.builder()
                .query(query)
                .searchTimeMs(searchTime)
                .knowledgeMatches(citations)
                .productMatches(products)
                .build();
    }

    /**
     * Hybrid retrieval using dense vector cosine similarity and lexical matching.
     */
    private List<RagCitationDto> retrieveRelevantChunks(String query, String categoryFilter, int topK) {
        double[] queryVector = vectorEmbeddingService.computeEmbedding(query);
        List<RagDocumentChunk> allChunks = chunkRepository.findAllWithDocument();

        if (allChunks.isEmpty()) {
            return Collections.emptyList();
        }

        record ScoredChunk(RagDocumentChunk chunk, double score) {}

        List<ScoredChunk> scoredList = new ArrayList<>();
        String lowerQuery = query.toLowerCase(Locale.ROOT);
        String[] queryTerms = lowerQuery.split("\\s+");

        for (RagDocumentChunk chunk : allChunks) {
            RagDocument doc = chunk.getDocument();
            if (categoryFilter != null && !categoryFilter.isBlank() && !categoryFilter.equalsIgnoreCase("ALL")) {
                if (!categoryFilter.equalsIgnoreCase(doc.getCategory())) {
                    continue;
                }
            }

            double[] chunkVector = vectorEmbeddingService.stringToVector(chunk.getEmbeddingVector());
            double cosineSim = vectorEmbeddingService.cosineSimilarity(queryVector, chunkVector);

            // Lexical boost: check for exact term matches in chunk text or title
            String lowerText = chunk.getChunkText().toLowerCase(Locale.ROOT);
            String lowerTitle = doc.getTitle().toLowerCase(Locale.ROOT);

            double keywordBoost = 0.0;
            for (String term : queryTerms) {
                if (term.length() > 2) {
                    if (lowerTitle.contains(term)) keywordBoost += 0.15;
                    if (lowerText.contains(term)) keywordBoost += 0.08;
                }
            }

            double totalScore = (cosineSim * 0.7) + Math.min(0.3, keywordBoost);
            scoredList.add(new ScoredChunk(chunk, totalScore));
        }

        scoredList.sort((a, b) -> Double.compare(b.score(), a.score()));

        List<RagCitationDto> citations = new ArrayList<>();
        int count = Math.min(topK, scoredList.size());
        for (int i = 0; i < count; i++) {
            ScoredChunk sc = scoredList.get(i);
            RagDocumentChunk c = sc.chunk();
            RagDocument d = c.getDocument();

            citations.add(RagCitationDto.builder()
                    .citationNumber(i + 1)
                    .documentId(d.getId())
                    .documentTitle(d.getTitle())
                    .slug(d.getSlug())
                    .category(d.getCategory())
                    .chunkIndex(c.getChunkIndex())
                    .snippet(c.getChunkText())
                    .relevanceScore(Math.round(sc.score() * 100.0) / 100.0)
                    .sourceUrl(d.getSourceUrl())
                    .build());
        }

        return citations;
    }

    private String formatConversationHistory(List<RagChatMessage> history) {
        if (history == null || history.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        int startIndex = Math.max(0, history.size() - 4); // last 4 turns
        for (int i = startIndex; i < history.size(); i++) {
            RagChatMessage msg = history.get(i);
            sb.append(msg.getRole().toUpperCase()).append(": ").append(msg.getContent()).append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public List<RagDocumentResponse> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RagDocumentResponse getDocumentById(UUID id) {
        RagDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge document not found with id: " + id));
        return mapToResponse(doc);
    }

    @Transactional
    public RagDocumentResponse createDocument(RagDocumentCreateRequest request) {
        String slug = generateSlug(request.getTitle());

        RagDocument doc = RagDocument.builder()
                .title(request.getTitle())
                .slug(slug)
                .category(request.getCategory())
                .summary(request.getSummary())
                .content(request.getContent())
                .tags(request.getTags())
                .author(request.getAuthor() != null ? request.getAuthor() : "AgriMarketplace Contributor")
                .sourceUrl(request.getSourceUrl())
                .readTimeMinutes(request.getReadTimeMinutes() != null ? request.getReadTimeMinutes() : 3)
                .build();

        RagDocument saved = documentRepository.save(doc);
        indexDocument(saved);

        return mapToResponse(saved);
    }

    public List<RagPromptSuggestionDto> getPromptSuggestions() {
        return List.of(
                RagPromptSuggestionDto.builder()
                        .category("ECX_GRADING_STANDARDS")
                        .icon("Award")
                        .title("Grading & Assay Standards")
                        .prompts(List.of(
                                "What is the maximum allowable moisture for Magna Teff under ECX standards?",
                                "What are the cupping and defect requirements for Q1 Specialty Coffee?",
                                "What protein and gluten percentage must durum wheat meet for pasta milling?"
                        ))
                        .build(),
                RagPromptSuggestionDto.builder()
                        .category("MARKET_PRICE_TRENDS")
                        .icon("TrendingUp")
                        .title("Market Dynamics & Mandi Rates")
                        .prompts(List.of(
                                "How do teff and wheat spot prices fluctuate between Meher and Belg harvests?",
                                "What are the benchmark rates in Debre Birhan and Kaliti terminals?",
                                "What is the typical inter-regional freight cost per quintal?"
                        ))
                        .build(),
                RagPromptSuggestionDto.builder()
                        .category("POST_HARVEST_STORAGE")
                        .icon("Warehouse")
                        .title("Warehousing & Silo Management")
                        .prompts(List.of(
                                "How should grain stacks be arranged on pallets according to WDRA standards?",
                                "How do electronic Negotiable Warehouse Receipts (e-NWR) work?",
                                "What precautions prevent aflatoxin and hot spots in cereal silos?"
                        ))
                        .build(),
                RagPromptSuggestionDto.builder()
                        .category("MARKETPLACE_POLICY")
                        .icon("ShieldCheck")
                        .title("Escrow & Order Safety")
                        .prompts(List.of(
                                "How does payment escrow protect buyers using Telebirr or CBE Birr?",
                                "What happens if delivered commodity moisture fails declared specs?",
                                "What is the step-by-step order fulfillment workflow for farmers?"
                        ))
                        .build()
        );
    }

    private RagDocumentResponse mapToResponse(RagDocument doc) {
        int chunkCount = doc.getChunks() != null ? doc.getChunks().size() : 0;
        return RagDocumentResponse.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .slug(doc.getSlug())
                .category(doc.getCategory())
                .summary(doc.getSummary())
                .content(doc.getContent())
                .tags(doc.getTags())
                .author(doc.getAuthor())
                .sourceUrl(doc.getSourceUrl())
                .readTimeMinutes(doc.getReadTimeMinutes())
                .chunkCount(chunkCount)
                .createdAt(doc.getCreatedAt())
                .updatedAt(doc.getUpdatedAt())
                .build();
    }

    private String generateSlug(String title) {
        String base = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        if (base.length() > 200) {
            base = base.substring(0, 200);
        }
        return base + "-" + System.currentTimeMillis();
    }
}
