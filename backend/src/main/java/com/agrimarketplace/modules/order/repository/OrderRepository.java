package com.agrimarketplace.modules.order.repository;

import com.agrimarketplace.modules.order.entity.Order;
import com.agrimarketplace.modules.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findByBuyerId(UUID buyerId, Pageable pageable);
    Page<Order> findByFarmerId(UUID farmerId, Pageable pageable);
    Page<Order> findByFarmerIdAndStatus(UUID farmerId, OrderStatus status, Pageable pageable);
    long countByFarmerIdAndStatus(UUID farmerId, OrderStatus status);
    long countByStatus(OrderStatus status);
}
