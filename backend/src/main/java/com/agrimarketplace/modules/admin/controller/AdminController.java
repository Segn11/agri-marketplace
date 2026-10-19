package com.agrimarketplace.modules.admin.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.modules.admin.dto.AdminDashboardStats;
import com.agrimarketplace.modules.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administration and platform moderation endpoints")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "Get admin dashboard platform metrics")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        AdminDashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Suspend or reactivate a user account")
    public ResponseEntity<ApiResponse<String>> updateUserStatus(
            @PathVariable UUID userId,
            @RequestParam String status
    ) {
        adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + status, null));
    }

    @PatchMapping("/products/{productId}/status")
    @Operation(summary = "Approve, hide or remove a listing")
    public ResponseEntity<ApiResponse<String>> updateProductStatus(
            @PathVariable UUID productId,
            @RequestParam String status
    ) {
        adminService.updateProductStatus(productId, status);
        return ResponseEntity.ok(ApiResponse.ok("Product status updated to " + status, null));
    }
}
