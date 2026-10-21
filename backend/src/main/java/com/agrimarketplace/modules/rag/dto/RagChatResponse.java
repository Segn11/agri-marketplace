package com.agrimarketplace.modules.rag.dto;

import com.agrimarketplace.modules.product.dto.ProductResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagChatResponse {
    private String query;
    private String answer;
    private String modelUsed;
    private Long processingTimeMs;

    @Builder.Default
    private List<RagCitationDto> citations = new ArrayList<>();

    @Builder.Default
    private List<ProductResponse> matchedProducts = new ArrayList<>();

    @Builder.Default
    private List<String> suggestedFollowUps = new ArrayList<>();
}
