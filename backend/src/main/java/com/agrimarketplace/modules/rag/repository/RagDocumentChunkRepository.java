package com.agrimarketplace.modules.rag.repository;

import com.agrimarketplace.modules.rag.entity.RagDocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RagDocumentChunkRepository extends JpaRepository<RagDocumentChunk, UUID> {

    List<RagDocumentChunk> findByDocumentIdOrderByChunkIndexAsc(UUID documentId);

    void deleteByDocumentId(UUID documentId);

    @Query("SELECT c FROM RagDocumentChunk c JOIN FETCH c.document WHERE " +
           "LOWER(c.chunkText) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<RagDocumentChunk> searchChunksByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c FROM RagDocumentChunk c JOIN FETCH c.document")
    List<RagDocumentChunk> findAllWithDocument();
}
