package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.CategoryOfShop;
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
public interface CategoryOfShopRepository extends JpaRepository<CategoryOfShop, UUID> {
    @Query("SELECT c FROM CategoryOfShop c " +
            "WHERE c.shopId = :shopId " +
            "AND c.isActive = true " +
            "AND EXISTS (SELECT 1 FROM ShopProductsCategory sp " +
            "WHERE sp.categoryOfShop.id = c.id " +
            "AND sp.product.isActive = TRUE " +
            "AND sp.product.status = :status " +
            "AND sp.product.isDeleted = FALSE)")
    List<CategoryOfShop> findActiveCategoriesWithProducts(@Param("shopId") String shopId, @Param("status") String status);

    @Query("SELECT c FROM CategoryOfShop c WHERE c.shopId = :shopId")
    List<CategoryOfShop> findAllCategoryOfShopByShopId(@Param("shopId") String shopId);
    @Query("SELECT c FROM CategoryOfShop c WHERE c.id = :id AND c.shopId = :shopId")
    Optional<CategoryOfShop> findByIdAndShopId(@Param("id") UUID id, @Param("shopId") String shopId);

    @Query("SELECT c FROM CategoryOfShop c WHERE c.name = :name AND c.shopId = :shopId")
    Optional<CategoryOfShop> findCategoryOfShopByName(@Param("name") String name, @Param("shopId") String shopId);
    @Query("SELECT c FROM CategoryOfShop c WHERE c.shopId = :shopId AND c.name = :name AND c.id != :id")
    Optional<CategoryOfShop> findCategoryOfShopByNameForEdit(
            @Param("name") String name,
            @Param("shopId") String shopId,
            @Param("id") UUID id
    );

    @Query("SELECT c FROM CategoryOfShop c " +
            "WHERE c.shopId = :shopId AND c.isActive = true " +
            "AND EXISTS (SELECT spc FROM ShopProductsCategory spc " +
            "WHERE spc.categoryOfShop = c " +
            "AND spc.product.isActive = true " +
            "AND spc.product.status = 'for sale' " +
            "AND spc.product.isDeleted = FALSE" +
            ")")
    List<CategoryOfShop> findListCategoryOfShopDecoration(
            Pageable pageable,
            @Param("shopId") String shopId
    );
}
