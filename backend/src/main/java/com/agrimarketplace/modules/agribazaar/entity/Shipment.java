package com.agrimarketplace.modules.agribazaar.entity;

import com.agrimarketplace.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, length = 150)
    private String transporterName;

    @Column(length = 150)
    private String driverName;

    @Column(nullable = false, length = 30)
    private String driverPhone;

    @Column(nullable = false, length = 50)
    private String vehiclePlateNumber;

    @Column(nullable = false, unique = true, length = 100)
    private String trackingNumber;

    @Column(nullable = false)
    private BigDecimal sourceWeightKg;

    private BigDecimal destinationWeightKg;

    @Column(length = 500)
    private String weightSlipUrl;

    @Column(length = 500)
    private String proofOfDeliveryUrl;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, PICKED_UP, IN_TRANSIT, DELIVERED, INSPECTED_ACCEPTED, DISPUTED

    private Instant pickupTime;

    private Instant estimatedDelivery;

    private Instant actualDelivery;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
