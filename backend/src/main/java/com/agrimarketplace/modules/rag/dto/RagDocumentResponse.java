package com.agrimarketplace.modules.rag.dto;

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
public class RagDocumentResponse {
    private UUID id;
    private String title;
    private String slug;
    private String category;
    private String summary;
    private String content;
    private String tags;
    private String author;
    private String sourceUrl;
    private Integer readTimeMinutes;
    private Integer chunkCount;
    private Instant createdAt;
    private Instant updatedAt;
}
