package com.project.supershop.features.voucher.repositories;

import com.project.supershop.features.voucher.domain.entities.DepotVoucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface DepotVoucherRepository extends JpaRepository<DepotVoucher, UUID>, PagingAndSortingRepository<DepotVoucher, UUID> {
    @Query("SELECT dv FROM DepotVoucher dv WHERE dv.voucher.id = :voucherId AND dv.account.id = :accountId")
    Optional<DepotVoucher> findByVoucherIdAndAccountId(@Param("voucherId") UUID voucherId, @Param("accountId") UUID accountId);

    @Query("SELECT dv FROM DepotVoucher dv WHERE dv.account.id = :accountId")
    Page<DepotVoucher> findAllByAccountId(Pageable pageable,@Param("accountId") UUID accountId);
    List<DepotVoucher> findAllByAccountId(UUID accountId);
}
