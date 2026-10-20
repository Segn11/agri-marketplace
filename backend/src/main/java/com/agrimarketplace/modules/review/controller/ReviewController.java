package com.agrimarketplace.modules.review.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.modules.review.dto.ReviewRequest;
import com.agrimarketplace.modules.review.dto.ReviewResponse;
import com.agrimarketplace.modules.review.service.ReviewService;
import com.agrimarketplace.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Endpoints for leaving reviews on completed orders")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Submit a rating and review for a completed order")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReviewResponse response = reviewService.submitReview(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Review submitted successfully", response));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get paginated reviews for a specific product")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getProductReviews(
            @PathVariable UUID productId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<ReviewResponse> response = reviewService.getProductReviews(productId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    @Operation(summary = "Get reviews for farmer's products")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getFarmerReviews(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<ReviewResponse> response = reviewService.getFarmerReviews(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove an inappropriate review (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.ok("Review removed successfully", null));
    }
}
