package com.agrimarketplace.modules.admin.service;

import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.admin.dto.AdminDashboardStats;
import com.agrimarketplace.modules.order.entity.OrderStatus;
import com.agrimarketplace.modules.order.repository.OrderRepository;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.report.repository.ReportRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .openReports(reportRepository.countByStatus("OPEN"))
                .build();
    }

    @Transactional
    public void updateUserStatus(UUID userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public void updateProductStatus(UUID productId, String status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStatus(status);
        productRepository.save(product);
    }
}
