package com.agrimarketplace.modules.agribazaar.entity;

import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bids_and_offers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private Product lot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(nullable = false, length = 30)
    private String type; // AUCTION_BID, NEGOTIATION_OFFER, SELLER_COUNTER

    @Column(nullable = false)
    private BigDecimal amount;

    private BigDecimal autoBidMax;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, OUTBID, ACCEPTED, REJECTED, EXPIRED

    @Column(columnDefinition = "TEXT")
    private String counterNote;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
