package com.agrimarketplace.modules.order.dto;

import com.agrimarketplace.modules.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private UUID buyerId;
    private String buyerName;
    private String buyerPhone; // Shown only when status >= ACCEPTED (FR-4.7)
    private UUID farmerId;
    private String farmerName;
    private String farmerPhone; // Shown only when status >= ACCEPTED (FR-4.7)
    private OrderStatus status;
    private String note;
    private String deliveryPreference;
    private BigDecimal totalPrice;
    private List<OrderItemDto> items;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private UUID productId;
        private String productName;
        private String productUnit;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
