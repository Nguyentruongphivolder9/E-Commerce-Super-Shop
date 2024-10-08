package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.HistoryViolation;
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
public interface HistoryViolationRepository extends JpaRepository<HistoryViolation, UUID> {
    @Query("SELECT hv FROM HistoryViolation hv " +
            "WHERE hv.product.id = :productId " +
            "ORDER BY hv.createdAt DESC")
    List<HistoryViolation> findByProductId(@Param("productId") UUID productId);
    @Query("SELECT hv FROM HistoryViolation hv " +
            "WHERE hv.product.id = :productId AND hv.isRepaired = :isRepaired " +
            "ORDER BY hv.createdAt DESC")
    Optional<HistoryViolation> findByProductIdAndIsRepaired(
            @Param("productId") UUID productId,
            @Param("isRepaired") Boolean isRepaired);

    int countByTypeViolationId(UUID typeViolationId);

    @Query("SELECT hv FROM HistoryViolation hv " +
            "WHERE hv.product.shop.id = :shopId " +
            "AND (:search IS NULL OR " +
            "(hv.product.name LIKE %:search% OR (cast(:search as uuid) IS NOT NULL AND hv.product.id = cast(:search as uuid)))) " +
            "ORDER BY hv.createdAt DESC")
    Page<HistoryViolation> findProductViolation(
            Pageable pageable,
            @Param("shopId") UUID shopId,
            @Param("search") String search
    );
}
