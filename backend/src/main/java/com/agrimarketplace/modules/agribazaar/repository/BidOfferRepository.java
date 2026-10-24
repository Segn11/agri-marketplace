package com.agrimarketplace.modules.agribazaar.repository;

import com.agrimarketplace.modules.agribazaar.entity.BidOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BidOfferRepository extends JpaRepository<BidOffer, UUID> {
    List<BidOffer> findByLotIdOrderByAmountDescCreatedAtDesc(UUID lotId);
    List<BidOffer> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId);
}
