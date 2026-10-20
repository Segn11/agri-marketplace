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
public class UserSummaryDto {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String location;
    private String status;
    private Instant createdAt;
}
