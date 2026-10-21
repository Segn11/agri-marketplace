package com.agrimarketplace.modules.rag.dto;

import jakarta.validation.constraints.NotBlank;
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
public class RagChatRequest {

    @NotBlank(message = "Query prompt cannot be empty")
    private String query;

    private String categoryFilter; // optional filter e.g. "ECX_GRADING_STANDARDS", "POST_HARVEST_STORAGE", etc.

    @Builder.Default
    private List<RagChatMessage> conversationHistory = new ArrayList<>();

    @Builder.Default
    private Integer topK = 4;

    @Builder.Default
    private Boolean includeMarketProducts = true;
}
