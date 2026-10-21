package com.agrimarketplace.modules.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagPromptSuggestionDto {
    private String category;
    private String icon;
    private String title;
    private List<String> prompts;
}
