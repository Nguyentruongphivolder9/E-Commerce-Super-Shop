package com.project.supershop.features.orders.repositories;

import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.domain.entities.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefundRepository  extends JpaRepository<Refund, UUID> {
    @Query("SELECT r FROM Refund r WHERE r.order.id = :orderId ORDER BY r.updatedAt DESC")
    Optional<Refund> findLatestRefundByOrderId(@Param("orderId") UUID orderId);


    @Query("SELECT r FROM Refund r WHERE r.shopId = :shopId")
    List<Refund> findRefundOrderByShopId(@Param("shopId") String shopId);

    @Query("SELECT r FROM Refund r WHERE r.id = :id")
    Optional<Refund> findById(@Param("id") UUID id);

    @Query(value = "SELECT r FROM Refund r " +
            "WHERE r.shopId = :shopId " +
            "AND (:status IS NULL OR r.status = :status)",
            countQuery = "SELECT COUNT(r) " +
                    "FROM Refund r " +
                    "WHERE r.shopId = :shopId " +
                    "AND (:status IS NULL OR r.status = :status)")
    Page<Refund> findListRefundOrderForShop(
            Pageable pageable,
            @Param("shopId") String shopId,
            @Param("status") String status
    );
}
