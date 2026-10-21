package com.agrimarketplace.modules.rag.service;

import com.agrimarketplace.modules.product.dto.ProductResponse;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Retrieves live marketplace inventory and commodities from the PostgreSQL database
 * to augment RAG responses with real, purchasable products and actual trade specs.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceContextRetriever {

    private final ProductRepository productRepository;
    private final ProductService productService;

    private static final List<String> COMMODITY_KEYWORDS = List.of(
            "teff", "magna", "sergegna", "coffee", "arabica", "sidama", "yirgacheffe", "guji", "jimma",
            "wheat", "durum", "semolina", "maize", "corn", "barley", "sorghum",
            "sesame", "pulses", "beans", "lentils", "chickpeas", "faba", "onion", "tomato", "potato", "garlic"
    );

    private static final List<String> REGION_KEYWORDS = List.of(
            "debre birhan", "hawassa", "bale", "robe", "addis ababa", "kaliti", "oromia", "amhara",
            "shewa", "sidama", "jimma", "adama", "dire dawa", "bahir dar", "gondar"
    );

    private static final Pattern PRICE_PATTERN = Pattern.compile("(?:under|below|less than|max|up to|<)\\s*(\\d+)", Pattern.CASE_INSENSITIVE);

    @Transactional(readOnly = true)
    public List<ProductResponse> retrieveMatchingProducts(String query, int maxResults) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String lowerQuery = query.toLowerCase(Locale.ROOT);

        // 1. Identify matched commodity keywords
        List<String> matchedCommodities = COMMODITY_KEYWORDS.stream()
                .filter(lowerQuery::contains)
                .collect(Collectors.toList());

        // 2. Identify matched regional locations
        String matchedLocation = REGION_KEYWORDS.stream()
                .filter(lowerQuery::contains)
                .findFirst()
                .orElse(null);

        // 3. Extract price ceiling if present
        BigDecimal maxPrice = null;
        Matcher priceMatcher = PRICE_PATTERN.matcher(lowerQuery);
        if (priceMatcher.find()) {
            try {
                maxPrice = new BigDecimal(priceMatcher.group(1));
            } catch (Exception ignored) {}
        }

        // If no specific commodity or location was detected, check if query contains "product", "listing", "price", "buy", "trade"
        boolean wantsMarketItems = !matchedCommodities.isEmpty() ||
                lowerQuery.contains("price") ||
                lowerQuery.contains("buy") ||
                lowerQuery.contains("listing") ||
                lowerQuery.contains("trade") ||
                lowerQuery.contains("stock") ||
                lowerQuery.contains("supplier") ||
                lowerQuery.contains("cooperative");

        if (!wantsMarketItems) {
            return Collections.emptyList();
        }

        String searchKeyword = !matchedCommodities.isEmpty() ? matchedCommodities.get(0) : null;

        try {
            Page<Product> page = productRepository.searchProducts(
                    searchKeyword,
                    null,
                    matchedLocation,
                    null,
                    maxPrice,
                    "ACTIVE",
                    PageRequest.of(0, maxResults)
            );

            List<Product> products = page.getContent();
            if (products.isEmpty() && searchKeyword != null) {
                // Relax location or search without filter
                page = productRepository.searchProducts(
                        searchKeyword,
                        null,
                        null,
                        null,
                        null,
                        "ACTIVE",
                        PageRequest.of(0, maxResults)
                );
                products = page.getContent();
            }

            return products.stream()
                    .map(productService::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Error retrieving marketplace context: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Formats retrieved active products into markdown format for the LLM prompt.
     */
    public String formatProductsForContext(List<ProductResponse> products) {
        if (products == null || products.isEmpty()) {
            return "No active marketplace listings currently match the specific criteria.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("### Active Marketplace Listings from Database:\n");
        for (int i = 0; i < products.size(); i++) {
            ProductResponse p = products.get(i);
            sb.append(String.format("- **Item %d: %s** (ID: `%s`)\n", i + 1, p.getName(), p.getId()));
            sb.append(String.format("  - **Price**: %s ETB per %s | **Available**: %d %s\n",
                    p.getUnitPrice() != null ? p.getUnitPrice().toString() : "N/A",
                    p.getUnit(),
                    p.getQuantityAvailable(),
                    p.getUnit()));
            sb.append(String.format("  - **Location**: %s | **Cooperative/Supplier**: %s\n",
                    p.getLocation(),
                    p.getCooperative() != null ? p.getCooperative() : p.getFarmerName()));
            if (p.getAssayGrade() != null) {
                sb.append(String.format("  - **Assay Grade**: %s | **Moisture**: %s | **Purity**: %s\n",
                        p.getAssayGrade(),
                        p.getMoistureContent() != null ? p.getMoistureContent() : "N/A",
                        p.getPurity() != null ? p.getPurity() : "N/A"));
            }
            if (p.getStorageWarehouse() != null) {
                sb.append(String.format("  - **Certified Warehouse**: %s\n", p.getStorageWarehouse()));
            }
        }
        return sb.toString();
    }
}
