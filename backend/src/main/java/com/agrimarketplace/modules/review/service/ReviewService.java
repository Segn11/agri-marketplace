package com.agrimarketplace.modules.review.service;

import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.common.exception.BadRequestException;
import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.order.entity.Order;
import com.agrimarketplace.modules.order.entity.OrderStatus;
import com.agrimarketplace.modules.order.repository.OrderRepository;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.review.dto.ReviewRequest;
import com.agrimarketplace.modules.review.dto.ReviewResponse;
import com.agrimarketplace.modules.review.entity.Review;
import com.agrimarketplace.modules.review.repository.ReviewRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(ReviewRequest request, UUID buyerId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new AccessDeniedException("Only the buyer who placed the order can submit a review");
        }

        // FR-7.1: A buyer shall be able to rate and comment only after an order is COMPLETED
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED orders");
        }

        // FR-7.2: Limit each completed order to one review per product
        if (reviewRepository.existsByOrderId(order.getId())) {
            throw new BadRequestException("A review has already been submitted for this order");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        Product product = order.getItems().get(0).getProduct();

        Review review = Review.builder()
                .order(order)
                .product(product)
                .buyer(buyer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    public PagedResponse<ReviewResponse> getProductReviews(UUID productId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductId(productId, pageable);
        return PagedResponse.from(page.map(this::mapToResponse));
    }

    private ReviewResponse mapToResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .orderId(r.getOrder().getId())
                .productId(r.getProduct().getId())
                .productName(r.getProduct().getName())
                .buyerId(r.getBuyer().getId())
                .buyerName(r.getBuyer().getFullName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
