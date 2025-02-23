package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerRepository extends JpaRepository<Seller, UUID> {
    @Query("SELECT DISTINCT s FROM Seller s " +
            "WHERE s.account.id = :shopId")
    Optional<Seller> findByShopId(@Param("shopId") UUID shopId);
}
