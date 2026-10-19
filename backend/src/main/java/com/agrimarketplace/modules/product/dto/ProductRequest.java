package com.agrimarketplace.modules.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal unitPrice;

    @NotBlank(message = "Unit of measure is required (e.g. KG, Quintal)")
    private String unit;

    @NotNull(message = "Available quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantityAvailable;

    @NotBlank(message = "Location is required")
    private String location;

    private String assayGrade;
    private String moistureContent;
    private String purity;
    private String harvestSeason;
    private String storageWarehouse;
    private String cooperative;
    private String badge;

    private List<String> imageUrls;
}
