package com.agrimarketplace.modules.agribazaar.entity;

import com.agrimarketplace.modules.order.entity.Order;
import com.agrimarketplace.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "disputes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;

    @Column(nullable = false, length = 50)
    private String claimType; // QUALITY_MISMATCH, WEIGHT_SHORTAGE, TRANSIT_DAMAGE, LATE_DELIVERY, WRONG_COMMODITY

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String evidenceNotes;

    @Column(nullable = false)
    private BigDecimal claimAmount;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "OPEN"; // OPEN, UNDER_INVESTIGATION, RESOLVED_REFUND, RESOLVED_PARTIAL, DISMISSED

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    private Instant resolvedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
