package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.ProductVariant;
import com.project.supershop.features.product.domain.entities.VariantGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    @Query("SELECT DISTINCT pv FROM ProductVariant pv " +
            "WHERE pv.product.id = :productId")
    List<ProductVariant> findAllProductVariantByProductId(@Param("productId") UUID productId);
    @Query("SELECT DISTINCT pv FROM ProductVariant pv " +
            "WHERE pv.id = :id AND pv.product.id = :productId")
    Optional<ProductVariant> findProductVariantByIdAndProductId(@Param("id") UUID id, @Param("productId") UUID productId);
}
