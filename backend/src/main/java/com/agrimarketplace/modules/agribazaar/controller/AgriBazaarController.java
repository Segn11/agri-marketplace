package com.agrimarketplace.modules.agribazaar.controller;

import com.agrimarketplace.common.ApiResponse;
import com.agrimarketplace.modules.agribazaar.entity.*;
import com.agrimarketplace.modules.agribazaar.service.AgriBazaarService;
import com.agrimarketplace.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "AgriBazaar Modules", description = "Endpoints for Mandi Bhav, AgriPay Wallets & Ledger, Auctions, Logistics, and Disputes")
public class AgriBazaarController {

    private final AgriBazaarService agriBazaarService;

    // --- MANDI BHAV ---
    @GetMapping("/mandi-prices")
    @Operation(summary = "Get live Mandi Bhav commodity prices across national terminals")
    public ResponseEntity<ApiResponse<List<MandiPrice>>> getMandiPrices() {
        return ResponseEntity.ok(ApiResponse.ok("Mandi prices loaded", agriBazaarService.getAllMandiPrices()));
    }

    // --- INPUT MARKETPLACE ---
    @GetMapping("/input-products")
    @Operation(summary = "Get agricultural inputs: certified seeds, fertilisers, pesticides, and equipment")
    public ResponseEntity<ApiResponse<List<InputProduct>>> getInputProducts(
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Input products loaded", agriBazaarService.getInputProducts(category)));
    }

    // --- AGRIPAY WALLET & LEDGER ---
    @GetMapping("/wallets/me")
    @Operation(summary = "Get current authenticated user's AgriPay wallet and balances")
    public ResponseEntity<ApiResponse<Wallet>> getMyWallet(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok("Wallet loaded", agriBazaarService.getOrCreateWallet(userPrincipal.getId())));
    }

    @PostMapping("/wallets/deposit")
    @Operation(summary = "Deposit funds into AgriPay wallet")
    public ResponseEntity<ApiResponse<Wallet>> deposit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body
    ) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String ref = body.get("referenceId") != null ? body.get("referenceId").toString() : null;
        return ResponseEntity.ok(ApiResponse.ok("Funds deposited successfully", agriBazaarService.depositToWallet(userPrincipal.getId(), amount, ref)));
    }

    @PostMapping("/wallets/withdraw")
    @Operation(summary = "Request payout withdrawal from AgriPay wallet to bank")
    public ResponseEntity<ApiResponse<Wallet>> withdraw(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body
    ) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String bankDetails = body.get("bankDetails") != null ? body.get("bankDetails").toString() : null;
        return ResponseEntity.ok(ApiResponse.ok("Payout withdrawal scheduled", agriBazaarService.withdrawFromWallet(userPrincipal.getId(), amount, bankDetails)));
    }

    @GetMapping("/wallets/ledger")
    @Operation(summary = "Get double-entry audit ledger transactions for current user")
    public ResponseEntity<ApiResponse<List<WalletLedgerEntry>>> getMyLedger(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok("Ledger retrieved", agriBazaarService.getUserLedger(userPrincipal.getId())));
    }

    @GetMapping("/admin/wallets/ledger")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin view of all marketplace double-entry ledger transactions")
    public ResponseEntity<ApiResponse<List<WalletLedgerEntry>>> getAllLedgers() {
        return ResponseEntity.ok(ApiResponse.ok("All financial ledgers retrieved", agriBazaarService.getAllLedgers()));
    }

    // --- AUCTION & NEGOTIATION ---
    @GetMapping("/bids/lot/{lotId}")
    @Operation(summary = "Get live bids and counter-offers for a produce lot")
    public ResponseEntity<ApiResponse<List<BidOffer>>> getLotBids(@PathVariable UUID lotId) {
        return ResponseEntity.ok(ApiResponse.ok("Bids loaded", agriBazaarService.getBidsForLot(lotId)));
    }

    @PostMapping("/bids")
    @Operation(summary = "Place an e-Auction bid or negotiable counter-offer")
    public ResponseEntity<ApiResponse<BidOffer>> placeBid(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body
    ) {
        UUID lotId = UUID.fromString(body.get("lotId").toString());
        String type = body.get("type") != null ? body.get("type").toString() : "AUCTION_BID";
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        BigDecimal autoBidMax = body.get("autoBidMax") != null ? new BigDecimal(body.get("autoBidMax").toString()) : null;
        String note = body.get("counterNote") != null ? body.get("counterNote").toString() : null;

        BidOffer bid = agriBazaarService.placeBidOrOffer(lotId, userPrincipal.getId(), type, amount, autoBidMax, note);
        return ResponseEntity.ok(ApiResponse.ok("Bid/Offer registered successfully", bid));
    }

    // --- LOGISTICS ---
    @GetMapping("/shipments/order/{orderId}")
    @Operation(summary = "Get shipment tracking and weighing details for an order")
    public ResponseEntity<ApiResponse<Shipment>> getShipment(@PathVariable UUID orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Shipment details", agriBazaarService.getShipmentByOrderId(orderId)));
    }

    @PutMapping("/shipments/{id}/status")
    @Operation(summary = "Update shipment tracking status, weight slips and proof of delivery")
    public ResponseEntity<ApiResponse<Shipment>> updateShipment(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body
    ) {
        String status = body.get("status") != null ? body.get("status").toString() : null;
        BigDecimal destWeight = body.get("destinationWeightKg") != null ? new BigDecimal(body.get("destinationWeightKg").toString()) : null;
        String slipUrl = body.get("weightSlipUrl") != null ? body.get("weightSlipUrl").toString() : null;
        String podUrl = body.get("proofOfDeliveryUrl") != null ? body.get("proofOfDeliveryUrl").toString() : null;

        Shipment updated = agriBazaarService.updateShipmentStatus(id, status, destWeight, slipUrl, podUrl);
        return ResponseEntity.ok(ApiResponse.ok("Shipment updated", updated));
    }

    // --- DISPUTE RESOLUTION ---
    @GetMapping("/disputes")
    @Operation(summary = "Get disputes (user's own disputes, or all disputes if admin)")
    public ResponseEntity<ApiResponse<List<Dispute>>> getDisputes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<Dispute> list = isAdmin ? agriBazaarService.getAllDisputes() : agriBazaarService.getUserDisputes(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Disputes retrieved", list));
    }

    @PostMapping("/disputes")
    @Operation(summary = "File a dispute claim regarding produce quality or weight mismatch")
    public ResponseEntity<ApiResponse<Dispute>> createDispute(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body
    ) {
        UUID orderId = UUID.fromString(body.get("orderId").toString());
        String claimType = body.get("claimType") != null ? body.get("claimType").toString() : "QUALITY_MISMATCH";
        String description = body.get("description").toString();
        BigDecimal amount = body.get("claimAmount") != null ? new BigDecimal(body.get("claimAmount").toString()) : null;

        Dispute dispute = agriBazaarService.createDispute(orderId, userPrincipal.getId(), claimType, description, amount);
        return ResponseEntity.ok(ApiResponse.ok("Dispute filed successfully", dispute));
    }

    @PutMapping("/admin/disputes/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin resolution of dispute claim (refund, release, or dismiss)")
    public ResponseEntity<ApiResponse<Dispute>> resolveDispute(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body
    ) {
        String resolutionStatus = body.get("status") != null ? body.get("status").toString() : "RESOLVED_REFUND";
        String notes = body.get("resolutionNotes") != null ? body.get("resolutionNotes").toString() : null;

        Dispute resolved = agriBazaarService.resolveDispute(id, userPrincipal.getId(), resolutionStatus, notes);
        return ResponseEntity.ok(ApiResponse.ok("Dispute adjudicated successfully", resolved));
    }
}
