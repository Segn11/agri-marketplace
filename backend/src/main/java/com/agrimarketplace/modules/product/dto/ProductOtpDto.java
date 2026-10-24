package com.agrimarketplace.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductOtpDto {
    private UUID productId;
    private String productName;
    private String otpCode;
    private String recipientPhone;
    private int expiresInMinutes;
    private String message;
}
