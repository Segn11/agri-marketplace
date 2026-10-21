package com.agrimarketplace.modules.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagCitationDto {
    private int citationNumber;
    private UUID documentId;
    private String documentTitle;
    private String slug;
    private String category;
    private Integer chunkIndex;
    private String snippet;
    private Double relevanceScore;
    private String sourceUrl;
}
