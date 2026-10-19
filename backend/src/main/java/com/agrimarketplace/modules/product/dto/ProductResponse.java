package com.agrimarketplace.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private UUID farmerId;
    private String farmerName;
    private String farmerPhone;
    private UUID categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal unitPrice;
    private String unit;
    private Integer quantityAvailable;
    private String location;
    private String status;
    private String assayGrade;
    private String moistureContent;
    private String purity;
    private String harvestSeason;
    private String storageWarehouse;
    private String cooperative;
    private String badge;
    private List<String> imageUrls;
    private Double averageRating;
    private Integer totalReviews;
    private Instant createdAt;
}
