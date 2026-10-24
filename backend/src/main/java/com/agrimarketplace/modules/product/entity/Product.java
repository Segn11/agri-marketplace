package com.agrimarketplace.modules.product.entity;

import com.agrimarketplace.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, length = 30)
    private String unit; // KG, QUINTAL, PIECE, LITER, CRATE

    @Column(nullable = false)
    private Integer quantityAvailable;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, OUT_OF_STOCK

    @Column(length = 150)
    private String assayGrade;

    @Column(length = 100)
    private String moistureContent;

    @Column(length = 100)
    private String purity;

    @Column(length = 120)
    private String harvestSeason;

    @Column(length = 200)
    private String storageWarehouse;

    @Column(length = 200)
    private String cooperative;

    @Column(length = 100)
    private String badge;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(length = 50)
    private String approvalMethod; // ADMIN, OTP_VERIFIED

    private Instant approvedAt;

    @Column(columnDefinition = "TEXT")
    private String approvalNotes;

    @Column(length = 10)
    private String otpCode;

    private Instant otpExpiresAt;

    @Version
    @Builder.Default
    private Integer version = 0; // Optimistic locking to prevent overselling (FR-5.4)

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
