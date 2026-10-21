package com.agrimarketplace.modules.rag.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagSearchRequest {

    @NotBlank(message = "Search query is required")
    private String query;

    private String category;

    @Builder.Default
    private Integer limit = 5;
}
