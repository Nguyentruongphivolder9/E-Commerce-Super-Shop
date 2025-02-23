package com.project.supershop.features.voucher.repositories;

import com.project.supershop.features.voucher.domain.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, UUID>, PagingAndSortingRepository<Voucher, UUID> {
    Optional<Voucher> findByCode(String code);
    Optional<Voucher> findById(UUID id);
    List<Voucher> findAllById(Iterable<UUID> ids);
    boolean existsById(UUID id);
    @Query("SELECT v FROM Voucher v WHERE v.account.id = :shopId")
    Page<Voucher> findAllByShopId(Pageable pageable,  @Param("shopId") UUID shopId);
    void deleteById(UUID id);
    @Query("SELECT v FROM Voucher v WHERE v.account.id IN :shopIds")
    List<Voucher> findVouchersByMultipleShop(@Param("shopIds") List<UUID> shopIds);

    @Query("SELECT v FROM Voucher v WHERE v.account.id IN :shopIds AND v.status = 'ongoing'")
    List<Voucher> findVouchersByMultipleShopWithOngoing(@Param("shopIds") List<UUID> shopIds);

    @Query("SELECT v FROM Voucher v WHERE v.endDate < :now AND v.status <> 'expire'")
    List<Voucher> findVouchersToExpire(@Param("now") LocalDateTime now);

    @Query("SELECT v FROM Voucher v WHERE v.startDate <= :now AND v.status = 'upcoming'")
    List<Voucher> findVouchersToStart(@Param("now") LocalDateTime now);
}
