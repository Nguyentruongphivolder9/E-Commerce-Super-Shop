package com.project.supershop.features.voucher.repositories;

import com.project.supershop.features.voucher.domain.entities.DepotVoucher;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoucherUsedRepository extends JpaRepository<VoucherUsed, UUID>, PagingAndSortingRepository<VoucherUsed, UUID> {
    List<VoucherUsed> findAllByAccountId(UUID accountId);

    @Query("SELECT v FROM VoucherUsed v WHERE v.voucher.id = :voucherId")
    List<VoucherUsed> findAllByVoucherId(@Param("voucherId") UUID voucherId);

    @Query("SELECT COUNT(v) FROM VoucherUsed v WHERE v.voucher.id = :voucherId AND v.account.id = :accountId")
    long countByVoucherIdAndAccountId(@Param("voucherId") UUID voucherId, @Param("accountId") UUID accountId);

    @Modifying
    @Transactional
    @Query("DELETE FROM VoucherUsed v WHERE v.voucher.id = :voucherId AND v.order.id = :orderId")
    void deleteByVoucherIdAndOrderId(@Param("voucherId") UUID voucherId, @Param("orderId") UUID orderId);
}
