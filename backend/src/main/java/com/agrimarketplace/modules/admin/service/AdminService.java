package com.agrimarketplace.modules.admin.service;

import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.admin.dto.AdminDashboardStats;
import com.agrimarketplace.modules.admin.dto.ReportSummaryDto;
import com.agrimarketplace.modules.admin.dto.UserSummaryDto;
import com.agrimarketplace.modules.order.repository.OrderRepository;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.report.entity.Report;
import com.agrimarketplace.modules.report.repository.ReportRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReportRepository reportRepository;

    public AdminDashboardStats getDashboardStats() {
        return AdminDashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalFarmers(userRepository.countByRole(com.agrimarketplace.modules.user.entity.Role.ROLE_FARMER))
                .totalBuyers(userRepository.countByRole(com.agrimarketplace.modules.user.entity.Role.ROLE_BUYER))
                .totalProducts(productRepository.count())
                .activeProducts(productRepository.countByStatus("ACTIVE"))
                .pendingProducts(productRepository.countByStatus("PENDING_APPROVAL"))
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(com.agrimarketplace.modules.order.entity.OrderStatus.PENDING))
                .completedOrders(orderRepository.countByStatus(com.agrimarketplace.modules.order.entity.OrderStatus.COMPLETED))
                .openReports(reportRepository.countByStatus("OPEN"))
                .build();
    }

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserSummaryDto.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .role(u.getRole().name())
                        .location(u.getLocation())
                        .status(u.getStatus())
                        .createdAt(u.getCreatedAt())
                        .isVerified(u.getFarmerProfile() != null ? u.getFarmerProfile().isVerified() : null)
                        .farmName(u.getFarmerProfile() != null ? u.getFarmerProfile().getFarmName() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void verifyFarmer(UUID userId, boolean isVerified) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getFarmerProfile() != null) {
            user.getFarmerProfile().setVerified(isVerified);
            userRepository.save(user);
        }
    }

    @Transactional
    public void updateUserStatus(UUID userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    @Transactional
    public void updateProductStatus(UUID productId, String status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStatus(status);
        productRepository.save(product);
    }

    public List<ReportSummaryDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(r -> ReportSummaryDto.builder()
                        .id(r.getId())
                        .reporterName(r.getReporter() != null ? r.getReporter().getFullName() : "Anonymous")
                        .reporterEmail(r.getReporter() != null ? r.getReporter().getEmail() : "N/A")
                        .targetType(r.getTargetType())
                        .targetId(r.getTargetId())
                        .reason(r.getReason())
                        .status(r.getStatus())
                        .resolutionNotes(r.getResolutionNotes())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateReportStatus(UUID reportId, String status, String resolutionNotes) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(status);
        if (resolutionNotes != null) {
            report.setResolutionNotes(resolutionNotes);
        }
        reportRepository.save(report);
    }
}
