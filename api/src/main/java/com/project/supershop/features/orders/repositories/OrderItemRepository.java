package com.project.supershop.features.orders.repositories;

import com.project.supershop.features.orders.domain.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    @Query("SELECT oi FROM OrderItem oi WHERE oi.id = :orderItemId")
    OrderItem findByOrderId(@Param("orderItemId") UUID orderItemId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.id IN :orderItemIds")
    List<OrderItem> findOrderItemsByIds(@Param("orderItemIds") List<UUID> orderItemIds);
}
