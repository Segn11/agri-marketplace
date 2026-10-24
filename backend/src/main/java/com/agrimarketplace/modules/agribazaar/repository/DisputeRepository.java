package com.agrimarketplace.modules.agribazaar.repository;

import com.agrimarketplace.modules.agribazaar.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, UUID> {
    List<Dispute> findByRaisedByIdOrderByCreatedAtDesc(UUID userId);
    List<Dispute> findAllByOrderByCreatedAtDesc();
}
