package com.agrimarketplace.modules.agribazaar.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "input_products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InputProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String supplierName;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // SEEDS, FERTILISERS, PESTICIDES, EQUIPMENT

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 500;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String badge;

    @Builder.Default
    private Boolean isOrganicCertified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
