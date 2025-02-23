package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.ProductFigure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductFigureRepository extends JpaRepository<ProductFigure, UUID> {
    @Query("SELECT pf FROM ProductFigure pf WHERE pf.product.id = :productId")
    Optional<ProductFigure> findByProductId(@Param("productId") UUID productId);
}
