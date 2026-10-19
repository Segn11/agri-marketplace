package com.agrimarketplace.modules.order.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.modules.order.dto.OrderCreateRequest;
import com.agrimarketplace.modules.order.dto.OrderResponse;
import com.agrimarketplace.modules.order.dto.OrderStatusUpdateRequest;
import com.agrimarketplace.modules.order.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Endpoints for placing, tracking, and updating orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Place a new order (Buyer only)")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @Valid @RequestBody OrderCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        OrderResponse response = orderService.placeOrder(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", response));
    }

    @GetMapping("/buyer")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Get list of orders placed by current buyer")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getBuyerOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<OrderResponse> orders = orderService.getBuyerOrders(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    @Operation(summary = "Get list of incoming orders for current farmer")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getFarmerOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<OrderResponse> orders = orderService.getFarmerOrders(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by order ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        OrderResponse order = orderService.getOrderById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status (Farmer accept/ready/complete, Buyer cancel)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody OrderStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        OrderResponse response = orderService.updateOrderStatus(id, request, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", response));
    }
}
