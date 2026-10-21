package com.agrimarketplace.modules.rag.repository;

import com.agrimarketplace.modules.rag.entity.RagDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RagDocumentRepository extends JpaRepository<RagDocument, UUID> {

    Optional<RagDocument> findBySlug(String slug);

    List<RagDocument> findByCategoryIgnoreCase(String category);

    Page<RagDocument> findByCategoryIgnoreCase(String category, Pageable pageable);

    @Query("SELECT d FROM RagDocument d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           "LOWER(d.summary) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           "LOWER(d.tags) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           "LOWER(d.content) LIKE LOWER(CONCAT('%', :kw, '%'))")
    List<RagDocument> searchByKeyword(@Param("kw") String keyword);
}
