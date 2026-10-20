package com.agrimarketplace.modules.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {

    @NotBlank(message = "Target type is required (e.g., LISTING, USER, REVIEW)")
    private String targetType;

    @NotNull(message = "Target ID is required")
    private UUID targetId;

    @NotBlank(message = "Reason is required")
    private String reason;
}
