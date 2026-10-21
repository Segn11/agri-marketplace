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
public class RagDocumentCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Summary is required")
    private String summary;

    @NotBlank(message = "Content is required")
    private String content;

    private String tags;
    private String author;
    private String sourceUrl;
    private Integer readTimeMinutes;
}
