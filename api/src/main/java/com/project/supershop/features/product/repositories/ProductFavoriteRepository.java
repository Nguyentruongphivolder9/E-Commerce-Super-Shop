package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductFavoriteRepository extends JpaRepository<ProductFavorite, UUID> {
    @Query("SELECT DISTINCT pf FROM ProductFavorite pf " +
            "WHERE pf.product.id = :productId AND pf.account.id = :accountId")
    Optional<ProductFavorite> findByProductIdAndAccountId(@Param("productId") UUID productId, @Param("accountId") UUID accountId);
}
