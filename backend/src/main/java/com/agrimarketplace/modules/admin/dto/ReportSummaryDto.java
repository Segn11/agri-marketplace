package com.agrimarketplace.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDto {
    private UUID id;
    private String reporterName;
    private String reporterEmail;
    private String targetType;
    private UUID targetId;
    private String reason;
    private String status;
    private String resolutionNotes;
    private Instant createdAt;
}
