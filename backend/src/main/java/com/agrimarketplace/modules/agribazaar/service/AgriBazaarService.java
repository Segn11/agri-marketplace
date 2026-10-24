package com.agrimarketplace.modules.agribazaar.service;

import com.agrimarketplace.common.exception.BadRequestException;
import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.agribazaar.entity.*;
import com.agrimarketplace.modules.agribazaar.repository.*;
import com.agrimarketplace.modules.order.entity.Order;
import com.agrimarketplace.modules.order.repository.OrderRepository;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AgriBazaarService {

    private final MandiPriceRepository mandiPriceRepository;
    private final WalletRepository walletRepository;
    private final WalletLedgerRepository walletLedgerRepository;
    private final InputProductRepository inputProductRepository;
    private final BidOfferRepository bidOfferRepository;
    private final ShipmentRepository shipmentRepository;
    private final DisputeRepository disputeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    // --- MANDI BHAV ---
    public List<MandiPrice> getAllMandiPrices() {
        return mandiPriceRepository.findAllByOrderByRecordedDateDescMandiMarketAsc();
    }

    // --- INPUT MARKETPLACE ---
    public List<InputProduct> getInputProducts(String category) {
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            return inputProductRepository.findByCategoryIgnoreCase(category.trim());
        }
        return inputProductRepository.findAll();
    }

    // --- AGRIPAY WALLET & DOUBLE-ENTRY LEDGER ---
    @Transactional
    public Wallet getOrCreateWallet(UUID userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return walletRepository.save(Wallet.builder()
                    .user(user)
                    .balance(BigDecimal.ZERO)
                    .escrowLocked(BigDecimal.ZERO)
                    .currency("ETB")
                    .build());
        });
    }

    @Transactional
    public Wallet depositToWallet(UUID userId, BigDecimal amount, String referenceId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be greater than zero");
        }
        Wallet wallet = getOrCreateWallet(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        Wallet saved = walletRepository.save(wallet);

        walletLedgerRepository.save(WalletLedgerEntry.builder()
                .wallet(saved)
                .user(saved.getUser())
                .entryType("DEBIT")
                .transactionType("DEPOSIT")
                .amount(amount)
                .balanceAfter(saved.getBalance())
                .referenceId(referenceId != null ? referenceId : "DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .description("Direct Bank / Gateway Deposit into AgriPay Wallet")
                .build());

        return saved;
    }

    @Transactional
    public Wallet withdrawFromWallet(UUID userId, BigDecimal amount, String bankDetails) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Withdrawal amount must be greater than zero");
        }
        Wallet wallet = getOrCreateWallet(userId);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient available balance. Available: " + wallet.getBalance() + " ETB");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        Wallet saved = walletRepository.save(wallet);

        walletLedgerRepository.save(WalletLedgerEntry.builder()
                .wallet(saved)
                .user(saved.getUser())
                .entryType("CREDIT")
                .transactionType("WITHDRAWAL")
                .amount(amount)
                .balanceAfter(saved.getBalance())
                .referenceId("WTH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .description("Bank Transfer Payout to: " + (bankDetails != null ? bankDetails : "Registered Account"))
                .build());

        return saved;
    }

    public List<WalletLedgerEntry> getUserLedger(UUID userId) {
        return walletLedgerRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<WalletLedgerEntry> getAllLedgers() {
        return walletLedgerRepository.findAllByOrderByCreatedAtDesc();
    }

    // --- AUCTION & NEGOTIATION ENGINE ---
    public List<BidOffer> getBidsForLot(UUID lotId) {
        return bidOfferRepository.findByLotIdOrderByAmountDescCreatedAtDesc(lotId);
    }

    @Transactional
    public BidOffer placeBidOrOffer(UUID lotId, UUID buyerId, String type, BigDecimal amount, BigDecimal autoBidMax, String counterNote) {
        Product product = productRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Bid / Offer amount must be greater than zero");
        }

        if ("AUCTION_BID".equalsIgnoreCase(type)) {
            if (!"AUCTION".equalsIgnoreCase(product.getTradeType())) {
                throw new BadRequestException("This produce lot is not listed as an e-Auction");
            }
            BigDecimal currentHigh = product.getCurrentHighestBid() != null ? product.getCurrentHighestBid() : product.getUnitPrice();
            BigDecimal minStep = product.getMinBidIncrement() != null ? product.getMinBidIncrement() : BigDecimal.valueOf(50);
            if (amount.compareTo(currentHigh.add(minStep)) < 0) {
                throw new BadRequestException("Bid must exceed current high of " + currentHigh + " by at least " + minStep + " ETB");
            }

            // Update product highest bid and anti-sniping timer
            product.setCurrentHighestBid(amount);
            product.setHighestBidderId(buyerId);

            // Anti-sniping: extend timer by 3 minutes if within 5 mins of end
            if (product.getAuctionEndAt() != null && product.getAuctionEndAt().isBefore(Instant.now().plusSeconds(300))) {
                product.setAuctionEndAt(Instant.now().plusSeconds(300));
            }
            productRepository.save(product);
        }

        BidOffer bid = BidOffer.builder()
                .lot(product)
                .buyer(buyer)
                .type(type != null ? type.toUpperCase() : "AUCTION_BID")
                .amount(amount)
                .autoBidMax(autoBidMax)
                .status("ACTIVE")
                .counterNote(counterNote)
                .build();

        return bidOfferRepository.save(bid);
    }

    // --- LOGISTICS & SHIPMENTS ---
    public Shipment getShipmentByOrderId(UUID orderId) {
        return shipmentRepository.findByOrderId(orderId).orElse(null);
    }

    @Transactional
    public Shipment updateShipmentStatus(UUID shipmentId, String status, BigDecimal destWeight, String slipUrl, String podUrl) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        if (status != null && !status.trim().isEmpty()) {
            shipment.setStatus(status.trim().toUpperCase());
        }
        if (destWeight != null) shipment.setDestinationWeightKg(destWeight);
        if (slipUrl != null) shipment.setWeightSlipUrl(slipUrl);
        if (podUrl != null) shipment.setProofOfDeliveryUrl(podUrl);
        if ("DELIVERED".equalsIgnoreCase(status)) shipment.setActualDelivery(Instant.now());

        return shipmentRepository.save(shipment);
    }

    // --- DISPUTE RESOLUTION CENTRE ---
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Dispute> getUserDisputes(UUID userId) {
        return disputeRepository.findByRaisedByIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Dispute createDispute(UUID orderId, UUID userId, String claimType, String description, BigDecimal claimAmount) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        order.setStatus(com.agrimarketplace.modules.order.entity.OrderStatus.DISPUTED);
        orderRepository.save(order);

        Dispute dispute = Dispute.builder()
                .order(order)
                .raisedBy(user)
                .claimType(claimType != null ? claimType : "QUALITY_MISMATCH")
                .description(description)
                .claimAmount(claimAmount != null ? claimAmount : order.getTotalPrice())
                .status("OPEN")
                .build();

        return disputeRepository.save(dispute);
    }

    @Transactional
    public Dispute resolveDispute(UUID disputeId, UUID adminId, String resolutionStatus, String notes) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        dispute.setStatus(resolutionStatus != null ? resolutionStatus : "RESOLVED_REFUND");
        dispute.setResolutionNotes(notes);
        dispute.setResolvedBy(admin);
        dispute.setResolvedAt(Instant.now());

        // Update linked order status
        Order order = dispute.getOrder();
        if ("RESOLVED_REFUND".equalsIgnoreCase(resolutionStatus)) {
            order.setStatus(com.agrimarketplace.modules.order.entity.OrderStatus.CANCELLED);
        } else if ("DISMISSED".equalsIgnoreCase(resolutionStatus)) {
            order.setStatus(com.agrimarketplace.modules.order.entity.OrderStatus.ACCEPTED);
        }
        orderRepository.save(order);

        return disputeRepository.save(dispute);
    }
}
