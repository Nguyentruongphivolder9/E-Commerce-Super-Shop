package com.project.supershop.features.advertise.repository;

import com.project.supershop.features.advertise.domain.entities.Advertise;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AdvertiseRepository extends JpaRepository<Advertise, UUID> {


    @Query("SELECT a FROM Advertise a " +
            "WHERE a.startDate < :now AND a.endDate > :now " +
            "ORDER BY a.esBanner DESC, a.createdAt ASC ")
    List<Advertise> findActiveAdvertises(LocalDateTime now);

    @Query("SELECT a FROM Advertise a WHERE a.account.id = :shopId AND a.isDeleted = false")
    List<Advertise> findAllByShopId(UUID shopId);

    @Query("SELECT a FROM Advertise a WHERE a.account.id = :shopId AND a.isDeleted = true")
    List<Advertise> findAllDeletedAdvertiseByShopId(UUID shopId);

    // Query to find unpaid advertisements that were created more than 5 minutes ago
    @Query("SELECT a FROM Advertise a WHERE a.payed = false AND a.isDeleted = false AND a.createdAt <= :timeLimit")
    List<Advertise> findUnpaidAdvertisesBefore(LocalDateTime timeLimit);

    @Query("SELECT a FROM Advertise a WHERE a.isDeleted = true ORDER BY a.createdAt DESC")
    List<Advertise> findDeletedAdvertises();

    @Query("SELECT a FROM Advertise a WHERE a.isDeleted = false ORDER BY a.createdAt DESC")
    List<Advertise> findNonDeleteAdvertises();

    @Modifying
    @Transactional
    @Query("UPDATE Advertise a SET a.click = a.click + 1 WHERE a.id = :id AND a.run = true AND a.payed = true AND a.status = 'Running'")
    void incrementClick(@Param("id") UUID id);

    // Custom query to find ads that overlap with the given start and end dates
    @Query("SELECT a FROM Advertise a WHERE a.account.id = :accountId AND a.isDeleted = false " +
            "AND (a.startDate < :endDate AND a.endDate > :startDate)")
    List<Advertise> findOverlappingAdvertisements(@Param("accountId") UUID accountId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);


    @Query("SELECT COUNT(a) FROM Advertise a WHERE a.isDeleted = false AND a.status IN ('Accepted', 'Running', 'Wait Accept') AND :startDateTime BETWEEN a.startDate AND a.endDate")
    int countAcceptedAdsByDayAndWithinRange(@Param("startDateTime") LocalDateTime startDateTime);






}
