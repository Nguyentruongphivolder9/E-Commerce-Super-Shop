package com.project.supershop.features.orders.repositories;

import com.project.supershop.features.orders.domain.entities.RefundImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefundImagesRepository extends JpaRepository<RefundImages, UUID> {
}

