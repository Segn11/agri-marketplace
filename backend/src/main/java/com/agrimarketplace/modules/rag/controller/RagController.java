package com.agrimarketplace.modules.rag.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.modules.rag.dto.*;
import com.agrimarketplace.modules.rag.service.RagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
@Tag(name = "RAG AI Advisor", description = "Retrieval-Augmented Generation (RAG) assistant, knowledge base, and semantic commodity search")
public class RagController {

    private final RagService ragService;

    @PostMapping("/chat")
    @Operation(summary = "Ask the Agricultural AI Copilot with grounded context, citations, and live product matching")
    public ResponseEntity<ApiResponse<RagChatResponse>> chat(@Valid @RequestBody RagChatRequest request) {
        RagChatResponse response = ragService.askCopilot(request);
        return ResponseEntity.ok(ApiResponse.ok("Query processed successfully", response));
    }

    @PostMapping("/search")
    @Operation(summary = "Semantic and hybrid search across verified knowledge base and active marketplace listings")
    public ResponseEntity<ApiResponse<RagSearchResponse>> search(@Valid @RequestBody RagSearchRequest request) {
        RagSearchResponse response = ragService.search(request);
        return ResponseEntity.ok(ApiResponse.ok("Search results retrieved", response));
    }

    @GetMapping("/documents")
    @Operation(summary = "Retrieve all verified agricultural reference documents and guides")
    public ResponseEntity<ApiResponse<List<RagDocumentResponse>>> getAllDocuments() {
        List<RagDocumentResponse> docs = ragService.getAllDocuments();
        return ResponseEntity.ok(ApiResponse.ok(docs));
    }

    @GetMapping("/documents/{id}")
    @Operation(summary = "Retrieve specific knowledge base document by UUID")
    public ResponseEntity<ApiResponse<RagDocumentResponse>> getDocumentById(@PathVariable UUID id) {
        RagDocumentResponse doc = ragService.getDocumentById(id);
        return ResponseEntity.ok(ApiResponse.ok(doc));
    }

    @PostMapping("/documents")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Index a new agricultural standard or reference manual (Admin only)")
    public ResponseEntity<ApiResponse<RagDocumentResponse>> createDocument(@Valid @RequestBody RagDocumentCreateRequest request) {
        RagDocumentResponse created = ragService.createDocument(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Document created and embedded successfully", created));
    }

    @GetMapping("/suggestions")
    @Operation(summary = "Retrieve starter prompt suggestions categorized for farmers and buyers")
    public ResponseEntity<ApiResponse<List<RagPromptSuggestionDto>>> getSuggestions() {
        List<RagPromptSuggestionDto> suggestions = ragService.getPromptSuggestions();
        return ResponseEntity.ok(ApiResponse.ok(suggestions));
    }
}
