package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.ProductInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductInterestRepository extends JpaRepository<ProductInterest, UUID> {
    @Query("SELECT DISTINCT pi FROM ProductInterest pi " +
            "WHERE pi.account.id = :accountId")
    Optional<ProductInterest> findProductInterestByAccountId(@Param("accountId") UUID accountId);
}
