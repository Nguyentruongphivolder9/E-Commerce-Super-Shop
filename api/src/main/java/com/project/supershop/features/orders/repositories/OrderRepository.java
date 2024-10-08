package com.project.supershop.features.orders.repositories;

import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    @Query("SELECT o FROM Order o WHERE o.vnpTxnRef = :vnpTxnRef")
    List<Order> findOrdersByVnpTxnRef(@Param("vnpTxnRef") String vnpTxnRef);

    @Query("SELECT o FROM Order o WHERE o.paymentIntentId = :paymentIntentId")
    List<Order> findpaymentIntentId(@Param("paymentIntentId") String paymentIntentId);

    @Transactional
    @Modifying
    void deleteByVnpTxnRef(@Param("vnpTxnRef") String vnpTxnRef);

    @Transactional
    @Modifying
    void deleteByPaymentIntentId(@Param("paymentIntentId") String paymentIntentId);

    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND (:status IS NULL OR o.orderStatus = :status)")
    List<Order> findByAccountIdAndStatus(@Param("accountId") UUID accountId, @Param("status") String status);

    @Query("SELECT o FROM Order o WHERE o.shopId = :shopId")
    List<Order> findByShopId(String shopId);

    @Query(value = "SELECT o FROM Order o " +
            "LEFT JOIN o.orderItems oi " +
            "WHERE " +
            "(:shopId IS NULL OR o.shopId = :shopId) AND " +
            "(:name IS NULL OR " +
            "(:name = 'orderId' AND (:search IS NULL OR CAST(o.id AS string) LIKE %:search%)) OR " +
            "(:name = 'recipientName' AND (:search IS NULL OR o.recipientName LIKE %:search%)) OR " +
            "(:name = 'productName' AND (:search IS NULL OR oi.productName LIKE %:search%))) " +
            "AND (:status IS NULL OR o.orderStatus = :status)",
            countQuery = "SELECT COUNT(DISTINCT o.id) " +
                    "FROM Order o " +
                    "LEFT JOIN o.orderItems oi " +
                    "WHERE " +
                    "(:shopId IS NULL OR o.shopId = :shopId) AND " +
                    "(:name IS NULL OR " +
                    "(:name = 'orderId' AND (:search IS NULL OR CAST(o.id AS string) LIKE %:search%)) OR " +
                    "(:name = 'recipientName' AND (:search IS NULL OR o.recipientName LIKE %:search%)) OR " +
                    "(:name = 'productName' AND (:search IS NULL OR oi.productName LIKE %:search%))) " +
                    "AND (:status IS NULL OR o.orderStatus = :status)")
    Page<Order> findListOrderForShop(
            Pageable pageable,
            @Param("shopId") String shopId,
            @Param("name") String name,
            @Param("search") String search,
            @Param("status") String status
    );

    @Query("SELECT o FROM Order o WHERE o.id = :orderId")
    Optional<Order> findByOrderId(UUID orderId);

}
