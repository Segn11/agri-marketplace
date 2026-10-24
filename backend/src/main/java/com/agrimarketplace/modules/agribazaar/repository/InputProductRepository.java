package com.agrimarketplace.modules.agribazaar.repository;

import com.agrimarketplace.modules.agribazaar.entity.InputProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InputProductRepository extends JpaRepository<InputProduct, UUID> {
    List<InputProduct> findByCategoryIgnoreCase(String category);
}
