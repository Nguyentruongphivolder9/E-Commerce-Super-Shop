package com.project.supershop.features.orders.repositories;

import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.domain.entities.OrderTimeLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderTimeLineRepository extends JpaRepository<OrderTimeLine, UUID> {
}
