package com.agrimarketplace.modules.rag.service;

import com.agrimarketplace.modules.product.dto.ProductResponse;
import com.agrimarketplace.modules.rag.dto.RagCitationDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * Service orchestrating LLM generation across Gemini, OpenAI,
 * and a robust standalone local agricultural synthesis engine.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LlmService {

    private final ObjectMapper objectMapper;

    @Value("${app.rag.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.rag.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${app.rag.openai.api-key:}")
    private String openaiApiKey;

    @Value("${app.rag.openai.model:gpt-4o-mini}")
    private String openaiModel;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public record GenerationResult(String answer, String modelUsed, List<String> followUps) {}

    /**
     * Generates a grounded response using the retrieved knowledge chunks and live products.
     */
    public GenerationResult generateResponse(
            String userQuery,
            List<RagCitationDto> citations,
            List<ProductResponse> products,
            String conversationContext
    ) {
        // Priority 1: Try Google Gemini API if key is present
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty() && !geminiApiKey.contains("your_")) {
            try {
                log.info("Generating RAG response via Google Gemini ({})", geminiModel);
                return callGemini(userQuery, citations, products, conversationContext);
            } catch (Exception e) {
                log.warn("Gemini generation failed, falling back to smart local synthesis: {}", e.getMessage());
            }
        }

        // Priority 2: Try OpenAI API if key is present
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty() && !openaiApiKey.contains("your_")) {
            try {
                log.info("Generating RAG response via OpenAI ({})", openaiModel);
                return callOpenAi(userQuery, citations, products, conversationContext);
            } catch (Exception e) {
                log.warn("OpenAI generation failed, falling back to smart local synthesis: {}", e.getMessage());
            }
        }

        // Priority 3: Standalone Smart Agricultural Knowledge Engine (Always available, 0 cost, instant)
        log.info("Using Standalone Smart Agricultural RAG Engine for query: {}", userQuery);
        return generateLocalAgriculturalSynthesis(userQuery, citations, products);
    }

    private GenerationResult callGemini(
            String userQuery,
            List<RagCitationDto> citations,
            List<ProductResponse> products,
            String conversationContext
    ) throws Exception {
        String prompt = buildPrompt(userQuery, citations, products, conversationContext);

        String endpoint = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
        );

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "maxOutputTokens", 1200
                )
        );

        String jsonPayload = objectMapper.writeValueAsString(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .timeout(Duration.ofSeconds(30))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode textNode = root.at("/candidates/0/content/parts/0/text");
            if (!textNode.isMissingNode()) {
                String text = textNode.asText();
                return new GenerationResult(text, "gemini (" + geminiModel + ")", extractFollowUps(userQuery));
            }
        }

        throw new RuntimeException("Gemini returned HTTP " + response.statusCode() + ": " + response.body());
    }

    private GenerationResult callOpenAi(
            String userQuery,
            List<RagCitationDto> citations,
            List<ProductResponse> products,
            String conversationContext
    ) throws Exception {
        String systemPrompt = "You are the AgriMarketplace AI Copilot and Agricultural Advisor. Provide accurate, professional answers grounded strictly in the provided context and active commodity database. Cite sources as [1], [2] where appropriate. If active products are relevant, mention them.";
        String userContent = buildPrompt(userQuery, citations, products, conversationContext);

        Map<String, Object> body = Map.of(
                "model", openaiModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userContent)
                ),
                "temperature", 0.2,
                "max_tokens", 1000
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .timeout(Duration.ofSeconds(30))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode content = root.at("/choices/0/message/content");
            if (!content.isMissingNode()) {
                return new GenerationResult(content.asText(), "openai (" + openaiModel + ")", extractFollowUps(userQuery));
            }
        }

        throw new RuntimeException("OpenAI returned HTTP " + response.statusCode() + ": " + response.body());
    }

    private String buildPrompt(
            String userQuery,
            List<RagCitationDto> citations,
            List<ProductResponse> products,
            String conversationContext
    ) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are the official Agricultural Marketplace AI Advisor & Commodity Copilot.\n");
        sb.append("Respond with accurate, practical advice grounded in the reference documents and live marketplace inventory below.\n\n");

        sb.append("=== RETRIEVED KNOWLEDGE BASE DOCUMENTS ===\n");
        if (citations.isEmpty()) {
            sb.append("No specific knowledge base articles retrieved.\n\n");
        } else {
            for (RagCitationDto c : citations) {
                sb.append(String.format("[%d] %s (%s):\n\"%s\"\n\n",
                        c.getCitationNumber(), c.getDocumentTitle(), c.getCategory(), c.getSnippet()));
            }
        }

        sb.append("=== LIVE MARKETPLACE INVENTORY (DATABASE) ===\n");
        if (products.isEmpty()) {
            sb.append("No active listings directly matching the query.\n\n");
        } else {
            for (ProductResponse p : products) {
                sb.append(String.format("- Product: %s | Price: %s ETB/%s | Quantity: %d %s | Location: %s | Grade: %s | Moisture: %s | Cooperative: %s\n",
                        p.getName(), p.getUnitPrice(), p.getUnit(), p.getQuantityAvailable(), p.getUnit(),
                        p.getLocation(), p.getAssayGrade(), p.getMoistureContent(), p.getCooperative()));
            }
            sb.append("\n");
        }

        if (conversationContext != null && !conversationContext.isEmpty()) {
            sb.append("=== RECENT CONVERSATION HISTORY ===\n");
            sb.append(conversationContext).append("\n\n");
        }

        sb.append("USER QUERY: ").append(userQuery).append("\n\n");
        sb.append("INSTRUCTIONS:\n");
        sb.append("1. Answer directly and comprehensively using clear markdown formatting.\n");
        sb.append("2. Ground your facts in the reference documents and cite them with [1], [2] brackets.\n");
        sb.append("3. If active marketplace listings are relevant, explicitly recommend them with their prices and assay details.\n");
        sb.append("4. Keep the tone authoritative, helpful, and agronomically sound.\n");

        return sb.toString();
    }

    /**
     * Robust, domain-tailored Agricultural Synthesis Engine that runs without external API keys.
     */
    private GenerationResult generateLocalAgriculturalSynthesis(
            String query,
            List<RagCitationDto> citations,
            List<ProductResponse> products
    ) {
        String lowerQuery = query.toLowerCase(Locale.ROOT);
        StringBuilder sb = new StringBuilder();

        // 1. Synthesize knowledge from citations
        if (!citations.isEmpty()) {
            RagCitationDto primary = citations.get(0);
            sb.append("### ").append(primary.getDocumentTitle()).append(" [1]\n\n");

            // Extract the most relevant sentences from snippets
            for (RagCitationDto cit : citations) {
                sb.append(cleanSnippet(cit.getSnippet())).append(" [").append(cit.getCitationNumber()).append("]\n\n");
            }
        } else {
            sb.append("### AgriMarketplace Agricultural Advisory\n\n");
            sb.append("Based on current Ethiopian Commodity Exchange (ECX) standards and certified post-harvest handling protocols:\n\n");
        }

        // 2. Add domain-specific insights based on detected intent
        if (lowerQuery.contains("teff") || lowerQuery.contains("magna")) {
            sb.append("#### 🌾 Key Teff Standards & Pricing Notes\n");
            sb.append("- **Moisture Limit**: Maximum allowable moisture is strictly **12.5%** (ideal range 10.5%–11.5%). Anything above 13.0% risks mold contamination and will be rejected at terminal warehouses.\n");
            sb.append("- **Grading**: Grade 1 Magna White Teff requires >= 99.0% sound seed purity and commands a 15–25% price premium over mixed (Sergegna) teff on wholesale terminals.\n\n");
        } else if (lowerQuery.contains("coffee") || lowerQuery.contains("sidama") || lowerQuery.contains("q1")) {
            sb.append("#### ☕ Specialty Coffee Quality & Moisture Protocols\n");
            sb.append("- **Moisture Window**: Must be maintained strictly between **10.0% and 11.5%** with certified GrainPro hermetic bag packaging.\n");
            sb.append("- **Grade Q1 Certification**: Requires an SCA cupping score of **>= 85.0 points** and zero full primary defects.\n\n");
        } else if (lowerQuery.contains("wheat") || lowerQuery.contains("durum") || lowerQuery.contains("pasta")) {
            sb.append("#### 🌾 Hard Amber Durum Wheat Specifications\n");
            sb.append("- **Protein & Gluten**: Industrial pasta millers require protein >= 13.5% dry basis and wet gluten index > 28%.\n");
            sb.append("- **Glassiness**: Minimum 80% vitreous kernels to produce coarse semolina rather than low-value starch flour.\n\n");
        } else if (lowerQuery.contains("storage") || lowerQuery.contains("warehouse") || lowerQuery.contains("silo") || lowerQuery.contains("wdra")) {
            sb.append("#### 🏬 Certified WDRA Silo & Storage Guidelines\n");
            sb.append("- **Pallet Spacing**: Bags must rest on wooden/plastic pallets raised **30cm** off the floor, with a **50cm** corridor from outer masonry walls for ventilation.\n");
            sb.append("- **Warehouse Humidity**: Maintain relative humidity below 65% to eliminate aflatoxin and grain weevil propagation.\n\n");
        } else if (lowerQuery.contains("price") || lowerQuery.contains("mandi") || lowerQuery.contains("trend")) {
            sb.append("#### 📈 Mandi Terminal Price Discovery\n");
            sb.append("- Peak arrivals during the **Meher harvest (Nov–Feb)** present the lowest farmgate procurement rates.\n");
            sb.append("- Prices typically peak during the lean season (July–Sept) by 25%–45% across Kaliti, Debre Birhan, and Hawassa hubs.\n\n");
        } else if (lowerQuery.contains("escrow") || lowerQuery.contains("pay") || lowerQuery.contains("telebirr") || lowerQuery.contains("order")) {
            sb.append("#### 🛡️ Safe Settlement & Trade Escrow\n");
            sb.append("- Payments via **Telebirr** and **CBE Birr** are held securely in escrow until destination inspection confirms moisture, grade, and weight match the agreed specifications.\n\n");
        }

        // 3. Attach matching live products from database
        if (products != null && !products.isEmpty()) {
            sb.append("#### 🛒 Matching Live Marketplace Listings\n");
            sb.append("The following active listings in our database match your requirements:\n\n");
            for (ProductResponse p : products) {
                sb.append(String.format("- **%s** — **%s ETB** / %s\n", p.getName(), p.getUnitPrice(), p.getUnit()));
                sb.append(String.format("  - *Location*: %s | *Supplier*: %s\n", p.getLocation(),
                        p.getCooperative() != null ? p.getCooperative() : p.getFarmerName()));
                if (p.getAssayGrade() != null) {
                    sb.append(String.format("  - *Grade & Moisture*: %s (%s moisture)\n", p.getAssayGrade(),
                            p.getMoistureContent() != null ? p.getMoistureContent() : "Tested"));
                }
                sb.append(String.format("  - *Available Quantity*: %d %s\n", p.getQuantityAvailable(), p.getUnit()));
            }
            sb.append("\nYou can view and trade directly with the cooperative on the marketplace.\n");
        }

        return new GenerationResult(sb.toString().trim(), "agri-rag-local-engine", extractFollowUps(query));
    }

    private String cleanSnippet(String snippet) {
        if (snippet == null) return "";
        // Replace excessive markdown hashes for cleaner inline reading
        return snippet.replace("### ", "").replace("## ", "").replace("# ", "");
    }

    private List<String> extractFollowUps(String query) {
        String lower = query.toLowerCase(Locale.ROOT);
        if (lower.contains("teff")) {
            return List.of(
                    "What is the current mandi rate for Grade 1 Magna Teff?",
                    "How to test teff moisture with a handheld probe?",
                    "Which cooperatives in Debre Birhan have active teff stock?"
            );
        } else if (lower.contains("coffee")) {
            return List.of(
                    "What are the defect tolerance limits for ECX Grade 2 coffee?",
                    "What is the moisture threshold for Sidama washed green beans?",
                    "Show live specialty coffee listings with SCA score above 85"
            );
        } else if (lower.contains("wheat") || lower.contains("durum")) {
            return List.of(
                    "What wet gluten index do Ethiopian pasta manufacturers require?",
                    "Where can I find durum wheat lots in Bale Zone?",
                    "What is the difference between bread wheat and amber durum?"
            );
        } else if (lower.contains("storage") || lower.contains("silo")) {
            return List.of(
                    "How to obtain an electronic Negotiable Warehouse Receipt (e-NWR)?",
                    "What are the best practices for hermetic grain bags?",
                    "How does phosphine fumigation work in certified silos?"
            );
        } else {
            return List.of(
                    "What are the ECX moisture standards for cereals and grains?",
                    "How does buyer trade escrow work with Telebirr and CBE Birr?",
                    "What commodities have active listings available today?"
            );
        }
    }
}
