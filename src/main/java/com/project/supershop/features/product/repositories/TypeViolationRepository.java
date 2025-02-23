package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.TypeViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TypeViolationRepository extends JpaRepository<TypeViolation, UUID> {
    Optional<TypeViolation> findByTitle(String title);
}
