package com.agrimarketplace.modules.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagChatMessage {
    private String role; // "user" or "assistant" or "system"
    private String content;
}
