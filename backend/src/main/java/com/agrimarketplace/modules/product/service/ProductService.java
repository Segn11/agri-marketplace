package com.agrimarketplace.modules.product.service;

import com.agrimarketplace.common.PagedResponse;
import com.agrimarketplace.common.exception.ResourceNotFoundException;
import com.agrimarketplace.modules.product.dto.ProductRequest;
import com.agrimarketplace.modules.product.dto.ProductResponse;
import com.agrimarketplace.modules.product.entity.Category;
import com.agrimarketplace.modules.product.entity.Product;
import com.agrimarketplace.modules.product.entity.ProductImage;
import com.agrimarketplace.modules.product.repository.CategoryRepository;
import com.agrimarketplace.modules.product.repository.ProductRepository;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public UUID findCategoryIdBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .map(Category::getId)
                .orElse(null);
    }

    public PagedResponse<ProductResponse> searchProducts(String keyword,
                                                         UUID categoryId,
                                                         String location,
                                                         BigDecimal minPrice,
                                                         BigDecimal maxPrice,
                                                         String status,
                                                         Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Product> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (location != null && !location.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("unitPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("unitPrice"), maxPrice));
            }

            String activeStatus = (status != null && !status.trim().isEmpty()) ? status : "ACTIVE";
            predicates.add(cb.equal(root.get("status"), activeStatus));

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return PagedResponse.from(productPage.map(this::mapToResponse));
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, UUID farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .farmer(farmer)
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .unitPrice(request.getUnitPrice())
                .unit(request.getUnit())
                .quantityAvailable(request.getQuantityAvailable())
                .location(request.getLocation())
                .status(request.getQuantityAvailable() > 0 ? "ACTIVE" : "OUT_OF_STOCK")
                .assayGrade(request.getAssayGrade())
                .moistureContent(request.getMoistureContent())
                .purity(request.getPurity())
                .harvestSeason(request.getHarvestSeason())
                .storageWarehouse(request.getStorageWarehouse())
                .cooperative(request.getCooperative())
                .badge(request.getBadge())
                .images(new ArrayList<>())
                .build();

        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .build();
                product.getImages().add(img);
            }
        }

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request, UUID currentUserId, boolean isAdmin) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getFarmer().getId().equals(currentUserId) && !isAdmin) {
            throw new AccessDeniedException("You cannot edit another farmer's product");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setUnitPrice(request.getUnitPrice());
        product.setUnit(request.getUnit());
        product.setQuantityAvailable(request.getQuantityAvailable());
        product.setLocation(request.getLocation());
        product.setAssayGrade(request.getAssayGrade());
        product.setMoistureContent(request.getMoistureContent());
        product.setPurity(request.getPurity());
        product.setHarvestSeason(request.getHarvestSeason());
        product.setStorageWarehouse(request.getStorageWarehouse());
        product.setCooperative(request.getCooperative());
        product.setBadge(request.getBadge());

        if (product.getQuantityAvailable() == 0) {
            product.setStatus("OUT_OF_STOCK");
        } else if ("OUT_OF_STOCK".equals(product.getStatus()) && product.getQuantityAvailable() > 0) {
            product.setStatus("ACTIVE");
        }

        return mapToResponse(productRepository.save(product));
    }

    public ProductResponse mapToResponse(Product product) {
        List<String> images = product.getImages() != null ?
                product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList()) :
                new ArrayList<>();

        return ProductResponse.builder()
                .id(product.getId())
                .farmerId(product.getFarmer().getId())
                .farmerName(product.getFarmer().getFullName())
                .farmerPhone(product.getFarmer().getPhone())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .description(product.getDescription())
                .unitPrice(product.getUnitPrice())
                .unit(product.getUnit())
                .quantityAvailable(product.getQuantityAvailable())
                .location(product.getLocation())
                .status(product.getStatus())
                .assayGrade(product.getAssayGrade())
                .moistureContent(product.getMoistureContent())
                .purity(product.getPurity())
                .harvestSeason(product.getHarvestSeason())
                .storageWarehouse(product.getStorageWarehouse())
                .cooperative(product.getCooperative())
                .badge(product.getBadge())
                .imageUrls(images)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
