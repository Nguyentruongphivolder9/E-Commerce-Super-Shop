package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.VariantGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantGroupRepository extends JpaRepository<VariantGroup, UUID> {
    @Query("SELECT DISTINCT vg FROM VariantGroup vg " +
            "WHERE vg.product.id = :productId")
    List<VariantGroup> findAllVariantGroupByProductId(@Param("productId") UUID productId);
}
