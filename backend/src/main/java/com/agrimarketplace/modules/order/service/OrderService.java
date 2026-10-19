package com.agrimarketplace.modules.order.service;

import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.common.exception.BadRequestException;
import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.order.dto.OrderCreateRequest;
import com.agrimarketplace.modules.order.dto.OrderResponse;
import com.agrimarketplace.modules.order.dto.OrderStatusUpdateRequest;
import com.agrimarketplace.modules.order.entity.Order;
import com.agrimarketplace.modules.order.entity.OrderItem;
import com.agrimarketplace.modules.order.entity.OrderStatus;
import com.agrimarketplace.modules.order.repository.OrderRepository;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse placeOrder(OrderCreateRequest request, UUID buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!"ACTIVE".equals(product.getStatus()) || product.getQuantityAvailable() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity (" + request.getQuantity() + 
                    ") exceeds available stock (" + product.getQuantityAvailable() + ")");
        }

        BigDecimal totalPrice = product.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = Order.builder()
                .buyer(buyer)
                .farmer(product.getFarmer())
                .status(OrderStatus.PENDING)
                .note(request.getNote())
                .deliveryPreference(request.getDeliveryPreference() != null ? request.getDeliveryPreference() : "PICKUP")
                .totalPrice(totalPrice)
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(request.getQuantity())
                .unitPrice(product.getUnitPrice())
                .build();

        order.getItems().add(item);
        Order saved = orderRepository.save(order);

        return mapToResponse(saved, buyerId);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatusUpdateRequest request, UUID currentUserId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        boolean isFarmer = order.getFarmer().getId().equals(currentUserId);
        boolean isBuyer = order.getBuyer().getId().equals(currentUserId);

        if (!isFarmer && !isBuyer && !isAdmin) {
            throw new AccessDeniedException("Unauthorized to modify this order");
        }

        OrderStatus newStatus = request.getStatus();

        // Status Transition logic according to SRS FR-4.4 & FR-4.5
        if (newStatus == OrderStatus.CANCELLED) {
            if (isBuyer && order.getStatus() != OrderStatus.PENDING && !isAdmin) {
                throw new BadRequestException("Buyers can only cancel orders while status is PENDING");
            }
            // If already accepted and cancelled, restore stock
            if (order.getStatus() == OrderStatus.ACCEPTED) {
                restoreStock(order);
            }
        } else if (newStatus == OrderStatus.ACCEPTED) {
            if (!isFarmer && !isAdmin) {
                throw new AccessDeniedException("Only the farmer can accept incoming orders");
            }
            if (order.getStatus() != OrderStatus.PENDING) {
                throw new BadRequestException("Only PENDING orders can be accepted");
            }
            // Deduct stock transactionally and check availability (FR-5.2, FR-5.4)
            deductStock(order);
        } else if (newStatus == OrderStatus.REJECTED) {
            if (!isFarmer && !isAdmin) {
                throw new AccessDeniedException("Only the farmer can reject incoming orders");
            }
            if (order.getStatus() != OrderStatus.PENDING) {
                throw new BadRequestException("Only PENDING orders can be rejected");
            }
        } else if (newStatus == OrderStatus.READY) {
            if (!isFarmer && !isAdmin) {
                throw new AccessDeniedException("Only the farmer can mark orders as READY");
            }
            if (order.getStatus() != OrderStatus.ACCEPTED) {
                throw new BadRequestException("Order must be ACCEPTED before marking READY");
            }
        } else if (newStatus == OrderStatus.COMPLETED) {
            if (!isFarmer && !isAdmin) {
                throw new AccessDeniedException("Only the farmer can mark orders as COMPLETED");
            }
            if (order.getStatus() != OrderStatus.READY && order.getStatus() != OrderStatus.ACCEPTED) {
                throw new BadRequestException("Order cannot be marked COMPLETED from current state");
            }
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated, currentUserId);
    }

    private void deductStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product.getQuantityAvailable() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product " + product.getName() + " to fulfill order.");
            }
            product.setQuantityAvailable(product.getQuantityAvailable() - item.getQuantity());
            if (product.getQuantityAvailable() == 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            productRepository.save(product);
        }
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantityAvailable(product.getQuantityAvailable() + item.getQuantity());
            if ("OUT_OF_STOCK".equals(product.getStatus()) && product.getQuantityAvailable() > 0) {
                product.setStatus("ACTIVE");
            }
            productRepository.save(product);
        }
    }

    public PagedResponse<OrderResponse> getBuyerOrders(UUID buyerId, Pageable pageable) {
        Page<Order> page = orderRepository.findByBuyerId(buyerId, pageable);
        return PagedResponse.from(page.map(o -> mapToResponse(o, buyerId)));
    }

    public PagedResponse<OrderResponse> getFarmerOrders(UUID farmerId, Pageable pageable) {
        Page<Order> page = orderRepository.findByFarmerId(farmerId, pageable);
        return PagedResponse.from(page.map(o -> mapToResponse(o, farmerId)));
    }

    public OrderResponse getOrderById(UUID orderId, UUID currentUserId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToResponse(order, currentUserId);
    }

    private OrderResponse mapToResponse(Order order, UUID currentUserId) {
        boolean showContacts = order.getStatus() == OrderStatus.ACCEPTED 
                || order.getStatus() == OrderStatus.READY 
                || order.getStatus() == OrderStatus.COMPLETED;

        return OrderResponse.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getFullName())
                .buyerPhone(showContacts ? order.getBuyer().getPhone() : null)
                .farmerId(order.getFarmer().getId())
                .farmerName(order.getFarmer().getFullName())
                .farmerPhone(showContacts ? order.getFarmer().getPhone() : null)
                .status(order.getStatus())
                .note(order.getNote())
                .deliveryPreference(order.getDeliveryPreference())
                .totalPrice(order.getTotalPrice())
                .items(order.getItems().stream().map(item -> OrderResponse.OrderItemDto.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productUnit(item.getProduct().getUnit())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build()).collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .build();
    }
}
