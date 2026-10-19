package com.agrimarketplace.modules.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private UUID orderId;
    private UUID productId;
    private String productName;
    private UUID buyerId;
    private String buyerName;
    private Integer rating;
    private String comment;
    private Instant createdAt;
}
