package com.project.supershop.features.voucher.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.voucher.domain.dto.requests.DepotVoucherRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "depotVoucher")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class DepotVoucher extends BaseEntity {
    private Integer quantity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucherId")
    private Voucher voucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountId")
    private Account account;
}
