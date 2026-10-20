package com.agrimarketplace.modules.report.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.report.dto.CreateReportRequest;
import com.agrimarketplace.modules.report.entity.Report;
import com.agrimarketplace.modules.report.repository.ReportRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import com.agrimarketplace.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "User reporting and dispute endpoints")
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a report against a listing, user, or review")
    public ResponseEntity<ApiResponse<String>> submitReport(
            @Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = Report.builder()
                .reporter(user)
                .targetType(request.getTargetType().toUpperCase())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .status("OPEN")
                .build();

        reportRepository.save(report);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Report submitted successfully for moderation", null));
    }
}
