package com.agrimarketplace.modules.agribazaar.repository;

import com.agrimarketplace.modules.agribazaar.entity.MandiPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MandiPriceRepository extends JpaRepository<MandiPrice, UUID> {
    List<MandiPrice> findAllByOrderByRecordedDateDescMandiMarketAsc();
    List<MandiPrice> findByCommodityNameIgnoreCase(String commodityName);
}
