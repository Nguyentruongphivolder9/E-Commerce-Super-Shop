package com.project.supershop.features.cart.repositories;

import com.project.supershop.features.cart.domain.entities.CartItem;
import com.project.supershop.features.product.domain.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findById(UUID id);
    @Query("SELECT DISTINCT ci FROM CartItem ci " +
            "WHERE ci.account.id = :accountId AND "+
            "ci.product.id = :productId AND " +
            "ci.productVariantId = :productVariantId")
    Optional<CartItem> findCartItemByAccountIdAndProductId(@Param("accountId") UUID accountId, @Param("productId") UUID productId, @Param("productVariantId") String productVariantId);

    @Query(value = "SELECT DISTINCT ci FROM CartItem ci WHERE ci.account.id = :accountId",
            countQuery = "SELECT COUNT(ci) FROM CartItem ci WHERE ci.account.id = :accountId")
    Page<CartItem> findListCartItemByAccountId(Pageable pageable, @Param("accountId") UUID accountId);

    boolean existsById(UUID id);

    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.id IN :listIdCartItem")
    Integer countAllByIdIn(@Param("listIdCartItem") Set<UUID> listIdCartItem);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.id IN :listIdCartItem AND ci.account.id = :accountId")
    void deteleMultipleCartByIdAndAccountId(@Param("listIdCartItem") Set<UUID> listIdCartItem, @Param("accountId") UUID accountId);

    @Query(value = "SELECT DISTINCT ci FROM CartItem ci WHERE ci.account.id = :accountId")
    List<CartItem> findListCartItemByAccountId(@Param("accountId") UUID accountId);
}
