package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.Variant;
import com.project.supershop.features.product.domain.entities.VariantGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VariantRepository extends JpaRepository<Variant, UUID> {
    @Query("SELECT DISTINCT v FROM Variant v " +
            "WHERE v.variantGroup.id = :variantGroupId")
    List<Variant> findAllVariantsByVariantGroupId(@Param("variantGroupId") UUID variantGroupId);
}
