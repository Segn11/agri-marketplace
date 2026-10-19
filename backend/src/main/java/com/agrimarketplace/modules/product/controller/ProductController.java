package com.agrimarketplace.modules.product.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.modules.product.dto.ProductRequest;
import com.agrimarketplace.modules.product.dto.ProductResponse;
import com.agrimarketplace.modules.product.service.ProductService;
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

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Endpoints for searching, viewing, and managing agricultural products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Search, filter, and paginate products")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        UUID categoryId = null;
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            try {
                categoryId = UUID.fromString(category.trim());
            } catch (IllegalArgumentException e) {
                categoryId = productService.findCategoryIdBySlug(category.trim());
            }
        }
        PagedResponse<ProductResponse> products = productService.searchProducts(
                q, categoryId, location, minPrice, maxPrice, status, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable UUID id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    @Operation(summary = "Create a new product listing (Farmer only)")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ProductResponse response = productService.createProduct(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Product listing created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    @Operation(summary = "Update an existing product listing")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ProductResponse response = productService.updateProduct(id, request, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Product listing updated successfully", response));
    }
}
