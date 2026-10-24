package com.agrimarketplace.modules.agribazaar.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mandi_prices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MandiPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String commodityName;

    @Column(length = 100)
    private String variety;

    @Column(nullable = false, length = 150)
    private String mandiMarket;

    @Column(nullable = false, length = 100)
    private String stateRegion;

    @Column(nullable = false)
    private BigDecimal minPrice;

    @Column(nullable = false)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    private BigDecimal modalPrice;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String unit = "Quintal (100kg)";

    @Builder.Default
    private Integer arrivalVolumeQuintals = 1200;

    @Column(length = 20)
    @Builder.Default
    private String trend = "UP"; // UP, DOWN, STABLE

    @Column(nullable = false)
    @Builder.Default
    private LocalDate recordedDate = LocalDate.now();
}
