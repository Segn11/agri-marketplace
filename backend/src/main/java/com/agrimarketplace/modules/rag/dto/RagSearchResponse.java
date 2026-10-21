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
public class RagSearchResponse {
    private String query;
    private Long searchTimeMs;

    @Builder.Default
    private List<RagCitationDto> knowledgeMatches = new ArrayList<>();

    @Builder.Default
    private List<ProductResponse> productMatches = new ArrayList<>();
}
