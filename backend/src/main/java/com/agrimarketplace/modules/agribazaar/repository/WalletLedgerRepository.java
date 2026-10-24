package com.agrimarketplace.modules.agribazaar.repository;

import com.agrimarketplace.modules.agribazaar.entity.WalletLedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WalletLedgerRepository extends JpaRepository<WalletLedgerEntry, UUID> {
    List<WalletLedgerEntry> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<WalletLedgerEntry> findAllByOrderByCreatedAtDesc();
}
