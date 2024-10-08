package com.project.supershop.features.product.repositories;

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
public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("SELECT DISTINCT p FROM Product p " +
            "WHERE p.shop.id = :shopId " +
            "AND p.id = :id " +
            "AND p.isDeleted = FALSE " +
            "AND p.isActive = :isActive")
    Optional<Product> findByProductIdAndIsActiveOfProductOfShop(@Param("id") UUID id, @Param("shopId") UUID shopId, @Param("isActive") boolean isActive);
    @Query("SELECT DISTINCT p FROM Product p " +
            "WHERE p.id = :id " +
            "AND p.isDeleted = FALSE " +
            "AND p.status = 'for sale' " +
            "AND p.isActive = true")
    Optional<Product> findByProductIdOfProduct(@Param("id") UUID id);
    @Query("SELECT DISTINCT p FROM Product p " +
            "WHERE p.shop.id = :shopId " +
            "AND p.isDeleted = FALSE " +
            "AND p.id = :id")
    Optional<Product> findByProductIdOfProductOfShop(@Param("id") UUID id, @Param("shopId") UUID shopId);

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.shop.id = :shopId " +
            "AND (:categoryId IS NULL OR p.categoryId LIKE CONCAT('%', :categoryId, '%')) " +
            "AND p.isDeleted = FALSE " +
            "AND (:search IS NULL OR " +
            "(p.name LIKE %:search% OR (cast(:search as uuid) IS NOT NULL AND p.id = cast(:search as uuid)))) " +
            "AND (:status IS NULL OR " +
            "(CASE " +
            "WHEN :status = 'UNLISTED' THEN p.status = :status OR p.isActive = FALSE " +
            "ELSE p.status = :status " +
            "END)) " +
            "AND (:violationType IS NULL OR EXISTS (" +
            "    SELECT hv FROM p.historyViolations hv WHERE hv.typeViolation.id = :violationType" +
            ")) " +
            "GROUP BY p.id",
            countQuery = "SELECT COUNT(DISTINCT p.id) " +
                    "FROM Product p " +
                    "WHERE p.shop.id = :shopId " +
                    "AND (:categoryId IS NULL OR p.categoryId LIKE CONCAT('%', :categoryId, '%')) " +
                    "AND p.isDeleted = FALSE " +
                    "AND (:search IS NULL OR " +
                    "(p.name LIKE %:search% OR (cast(:search as uuid) IS NOT NULL AND p.id = cast(:search as uuid)))) " +
                    "AND (:status IS NULL OR " +
                    "(CASE " +
                    "WHEN :status = 'UNLISTED' THEN p.status = :status OR p.isActive = TRUE " +
                    "ELSE p.status = :status " +
                    "END)) " +
                    "AND (:violationType IS NULL OR EXISTS (" +
                    "    SELECT hv FROM p.historyViolations hv WHERE hv.typeViolation.id = :violationType" +
                    "))")
    Page<Product> findListProductOfShop(
            Pageable pageable,
            @Param("categoryId") String categoryId,
            @Param("shopId") UUID shopId,
            @Param("search") String search,
            @Param("status") String status,
            @Param("violationType") UUID violationType);

    @Query("SELECT DISTINCT p.categoryId " +
            "FROM Product p " +
            "WHERE p.shop.id = :shopId " +
            "AND p.isDeleted = FALSE")
    List<String> findListCategoryOfShop(@Param("shopId") UUID shopId);

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.categoryId LIKE CONCAT('%', :categoryId, '%') " +
            "AND p.isActive = TRUE " +
            "AND p.isDeleted = FALSE " +
            "AND p.productFigure.ratingStar <= :ratingStar " +
            "AND (:minPrice IS NULL OR COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price) >= :minPrice) " +
            "AND (:maxPrice IS NULL OR COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price) <= :maxPrice) " +
            "AND (:conditionProduct IS NULL OR p.conditionProduct = :conditionProduct) " +
            "AND p.status = :status",
            countQuery = "SELECT COUNT(DISTINCT p.id) " +
                    "FROM Product p " +
                    "WHERE p.categoryId LIKE CONCAT('%', :categoryId, '%') " +
                    "AND p.isActive = TRUE " +
                    "AND p.isDeleted = FALSE " +
                    "AND p.productFigure.ratingStar <= :ratingStar " +
                    "AND (:minPrice IS NULL OR COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price) >= :minPrice) " +
                    "AND (:maxPrice IS NULL OR COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price) <= :maxPrice) " +
                    "AND (:conditionProduct IS NULL OR p.conditionProduct = :conditionProduct) " +
                    "AND p.status = :status")
    Page<Product> findListProductOfCategoryForUser(
            Pageable pageable,
            @Param("categoryId") String categoryId,
            @Param("ratingStar") Double ratingStar,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("conditionProduct") String conditionProduct,
            @Param("status") String status
    );

    @Query(value = "SELECT p FROM Product p " +
            "WHERE (:categoryId IS NULL OR p.categoryId LIKE CONCAT('%', :categoryId, '%')) " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND p.isDeleted = FALSE " +
            "AND (:search IS NULL OR " +
            "(p.name LIKE %:search% OR (cast(:search as uuid) IS NOT NULL AND p.id = cast(:search as uuid)))) " +
            "GROUP BY p.id",
            countQuery = "SELECT COUNT(DISTINCT p.id) " +
                    "FROM Product p " +
                    "WHERE (:categoryId IS NULL OR p.categoryId LIKE CONCAT('%', :categoryId, '%')) " +
                    "AND p.isDeleted = FALSE " +
                    "AND (:search IS NULL OR " +
                    "(p.name LIKE %:search% OR (cast(:search as uuid) IS NOT NULL AND p.id = cast(:search as uuid)))) " +
                    "AND (:status IS NULL OR p.status = :status)")
    Page<Product> findListProductForAdmin(
            Pageable pageable,
            @Param("categoryId") String categoryId,
            @Param("search") String search,
            @Param("status") String status
    );

    @Query("SELECT DISTINCT p.categoryId " +
            "FROM Product p " +
            "WHERE (:status IS NULL OR p.status = :status) " +
            "AND p.isDeleted = FALSE"
    )
    List<String> findListCategoryUsed(@Param("status") String status);

    @Query("SELECT DISTINCT p FROM Product p " +
            "WHERE p.shop.id = :shopId " +
            "AND p.id = :id " +
            "AND p.isDeleted = FALSE " +
            "AND p.isActive = TRUE " +
            "AND p.status = :status")
    Optional<Product> findByProductIdForUser(
            @Param("id") UUID id,
            @Param("shopId") UUID shopId,
            @Param("status") String status
    );

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.isActive = TRUE " +
            "AND p.isDeleted = FALSE " +
            "AND p.productFigure.ratingStar <= :ratingStar " +
            "AND p.status = :status " +
            "GROUP BY p.id",
            countQuery = "SELECT COUNT(DISTINCT p.id) FROM Product p " +
                    "WHERE p.isActive = TRUE " +
                    "AND p.isDeleted = FALSE " +
                    "AND p.productFigure.ratingStar <= :ratingStar " +
                    "AND p.status = :status")
    Page<Product> findListProductRecommendationForUser(
            Pageable pageable,
            @Param("ratingStar") Double ratingStar,
            @Param("status") String status
    );

    @Query("SELECT COUNT(p) FROM Product p " +
            "WHERE p.categoryId LIKE CONCAT('%', :categoryId, '%')")
    int countProductByCategoryId(@Param("categoryId") String categoryId);

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.isActive = TRUE " +
            "AND p.status = :status " +
            "AND p.isDeleted = FALSE " +
            "ORDER BY p.productFigure.sold DESC")
    List<Product> findTop20ProductsBySales(
            @Param("status") String status,
            Pageable pageable
    );
    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.isActive = TRUE " +
            "AND p.id = :id " +
            "AND p.isDeleted = FALSE " +
            "AND p.shop.id = :shopId " +
            "AND p.status = :status")
    Optional<Product> findByIdAndShopId(
            @Param("id") UUID id,
            @Param("shopId") UUID shopId,
            @Param("status") String status
    );

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.isActive = TRUE " +
            "AND p.shop.id = :shopId " +
            "AND p.isDeleted = FALSE " +
            "AND p.productFigure.ratingStar <= :ratingStar " +
            "AND p.status = :status " +
            "AND (:categoryOfShopId IS NULL OR EXISTS (SELECT sp FROM ShopProductsCategory sp WHERE sp.product.id = p.id AND sp.categoryOfShop.id = :categoryOfShopId))",
            countQuery = "SELECT COUNT(DISTINCT p.id) " +
                    "FROM Product p " +
                    "WHERE p.isActive = TRUE " +
                    "AND p.shop.id = :shopId " +
                    "AND p.isDeleted = FALSE " +
                    "AND p.productFigure.ratingStar <= :ratingStar " +
                    "AND p.status = :status " +
                    "AND (:categoryOfShopId IS NULL OR EXISTS (SELECT sp FROM ShopProductsCategory sp WHERE sp.product.id = p.id AND sp.categoryOfShop.id = :categoryOfShopId))")
    Page<Product> findListProductShopDetail(
            Pageable pageable,
            @Param("shopId") UUID shopId,
            @Param("categoryOfShopId") UUID categoryOfShopId,
            @Param("ratingStar") Double ratingStar,
            @Param("status") String status
    );
}
