package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.CategoryOfShop;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ShopProductsCategory;
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
public interface ShopProductsCategoryRepository extends JpaRepository<ShopProductsCategory, UUID> {
    @Query("SELECT pc FROM ShopProductsCategory pc " +
            "WHERE pc.product.id = :productId AND pc.categoryOfShop.id = :categoryOfShopId")
    Optional<ShopProductsCategory> findProductExistsInCategoryOfShop(
            @Param("productId") UUID productId,
            @Param("categoryOfShopId") UUID categoryOfShopId
    );

    @Query("SELECT pc FROM ShopProductsCategory pc " +
            "WHERE pc.categoryOfShop.id = :categoryOfShopId")
    List<ShopProductsCategory> findByCategoryOfShopId(
            Pageable pageable,
            @Param("categoryOfShopId") UUID categoryOfShopId
    );

    @Query("SELECT COUNT(pc) FROM ShopProductsCategory pc " +
            "WHERE pc.categoryOfShop.id = :categoryOfShopId " +
            "AND pc.product.isActive = TRUE " +
            "AND pc.product.status = 'for sale' " +
            "AND pc.product.isDeleted = FALSE")
    int countActiveProducts(
            @Param("categoryOfShopId") UUID categoryOfShopId
    );
}
