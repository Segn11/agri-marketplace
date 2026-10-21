package com.agrimarketplace.modules.rag.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Service for text chunking, dense semantic vector computation,
 * and cosine similarity ranking.
 */
@Service
@Slf4j
public class VectorEmbeddingService {

    public static final int VECTOR_DIMENSIONS = 256;
    private static final Pattern WORD_PATTERN = Pattern.compile("[\\p{L}\\p{Nd}]+");
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by", "of", "from",
            "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "can", "could", "shall", "should", "will", "would", "may", "might", "must", "it", "its", "that",
            "this", "these", "those", "which", "who", "whom", "what", "where", "when", "why", "how", "all"
    );

    /**
     * Splits text into coherent overlapping chunks suitable for RAG retrieval.
     */
    public List<String> chunkText(String text, int targetChunkSize, int overlap) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // Split by markdown headers or paragraph breaks first
        String[] paragraphs = text.split("\n\\s*\n");
        List<String> chunks = new ArrayList<>();
        StringBuilder currentChunk = new StringBuilder();

        for (String paragraph : paragraphs) {
            String trimmed = paragraph.trim();
            if (trimmed.isEmpty()) continue;

            if (currentChunk.length() + trimmed.length() > targetChunkSize && currentChunk.length() > 0) {
                chunks.add(currentChunk.toString().trim());
                // Retain overlap from end of previous chunk if possible
                int keepChars = Math.min(overlap, currentChunk.length());
                String overlapText = currentChunk.substring(currentChunk.length() - keepChars);
                currentChunk = new StringBuilder(overlapText).append("\n\n");
            }

            currentChunk.append(trimmed).append("\n\n");
        }

        if (currentChunk.length() > 0 && !currentChunk.toString().trim().isEmpty()) {
            chunks.add(currentChunk.toString().trim());
        }

        return chunks;
    }

    /**
     * Computes a normalized dense vector embedding (256-D) based on term frequency,
     * subword character trigrams, and semantic feature hashing.
     */
    public double[] computeEmbedding(String text) {
        double[] vector = new double[VECTOR_DIMENSIONS];
        if (text == null || text.trim().isEmpty()) {
            return vector;
        }

        String lower = text.toLowerCase(Locale.ROOT);
        List<String> words = new ArrayList<>();
        var matcher = WORD_PATTERN.matcher(lower);
        while (matcher.find()) {
            String word = matcher.group();
            if (!STOP_WORDS.contains(word)) {
                words.add(word);
            }
        }

        if (words.isEmpty()) {
            return vector;
        }

        // 1. Word-level hashing with TF weighting
        for (int i = 0; i < words.size(); i++) {
            String word = words.get(i);
            int hash1 = Math.abs(word.hashCode()) % VECTOR_DIMENSIONS;
            vector[hash1] += 2.0;

            // Bi-gram hashing
            if (i < words.size() - 1) {
                String bigram = word + "_" + words.get(i + 1);
                int hashBigram = Math.abs(bigram.hashCode()) % VECTOR_DIMENSIONS;
                vector[hashBigram] += 3.0;
            }

            // Character trigram hashing for morphology & root words (e.g., moisture, moist, teff, grain)
            if (word.length() >= 3) {
                for (int c = 0; c <= word.length() - 3; c++) {
                    String trigram = word.substring(c, c + 3);
                    int hashTrigram = Math.abs(trigram.hashCode()) % VECTOR_DIMENSIONS;
                    vector[hashTrigram] += 0.5;
                }
            }
        }

        // 2. L2 Normalization so dot product equals cosine similarity
        double sumSquares = 0.0;
        for (double v : vector) {
            sumSquares += v * v;
        }
        if (sumSquares > 0) {
            double norm = Math.sqrt(sumSquares);
            for (int i = 0; i < vector.length; i++) {
                vector[i] /= norm;
            }
        }

        return vector;
    }

    /**
     * Computes Cosine Similarity between two normalized vectors.
     */
    public double cosineSimilarity(double[] vecA, double[] vecB) {
        if (vecA == null || vecB == null || vecA.length != vecB.length) {
            return 0.0;
        }
        double dotProduct = 0.0;
        for (int i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
        }
        return Math.max(0.0, Math.min(1.0, dotProduct));
    }

    /**
     * Serializes embedding vector to compact string for database storage.
     */
    public String vectorToString(double[] vector) {
        if (vector == null) return "";
        StringBuilder sb = new StringBuilder(vector.length * 6);
        for (int i = 0; i < vector.length; i++) {
            sb.append(String.format(Locale.ROOT, "%.4f", vector[i]));
            if (i < vector.length - 1) sb.append(",");
        }
        return sb.toString();
    }

    /**
     * Deserializes string representation back to double array.
     */
    public double[] stringToVector(String str) {
        if (str == null || str.trim().isEmpty()) {
            return new double[VECTOR_DIMENSIONS];
        }
        String[] parts = str.split(",");
        double[] vector = new double[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                vector[i] = Double.parseDouble(parts[i].trim());
            } catch (NumberFormatException e) {
                vector[i] = 0.0;
            }
        }
        return vector;
    }
}
