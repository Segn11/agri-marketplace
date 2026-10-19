package com.agrimarketplace.modules.order.dto;

import com.agrimarketplace.modules.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {

    @NotNull(message = "New status is required")
    private OrderStatus status;

    private String reason; // Optional reason (e.g., when rejected or cancelled)
}
