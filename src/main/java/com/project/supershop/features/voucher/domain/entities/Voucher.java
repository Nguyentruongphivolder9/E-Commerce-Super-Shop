package com.project.supershop.features.voucher.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.voucher.domain.dto.requests.VoucherRequest;
import com.project.supershop.features.voucher.utils.enums.DiscountTypeEnum;
import com.project.supershop.features.voucher.utils.enums.StatusVoucherEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vouchers")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Voucher extends BaseEntity {
    private String name;
    private String code;
    private String voucherType;
    private String discountType;
    private Double fixedAmount;
    private Double percentageAmount;
    private Double maximumDiscount;
    private Double minimumTotalOrder;
    private Boolean isLimit;
    private Integer quantity;
    private Integer maxDistribution;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DepotVoucher> depotVouchers;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VoucherUsed> vouchersUsed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopId")
    private Account account;


    public static Voucher createVoucher(VoucherRequest voucherRequest){
        String fixedType = DiscountTypeEnum.FIXED.value();
        String percentageType = DiscountTypeEnum.PERCENTAGE.value();
        VoucherBuilder<?, ?> voucher =  Voucher.builder()
                .name(voucherRequest.getName())
                .code(voucherRequest.getCode())
                .voucherType(voucherRequest.getVoucherType())
                .discountType(voucherRequest.getDiscountType())
                .minimumTotalOrder(voucherRequest.getMinimumTotalOrder())
                .quantity(voucherRequest.getQuantity())
                .maxDistribution(voucherRequest.getMaxDistribution())
                .startDate(voucherRequest.getStartDate())
                .endDate(voucherRequest.getEndDate());


        if (voucherRequest.getDiscountType().equals(fixedType) && voucherRequest.getFixedAmount() != null) {
            voucher.fixedAmount(voucherRequest.getFixedAmount());
            voucher.percentageAmount(null);
            voucher.maximumDiscount(null);
            voucher.isLimit(null);
        }
        if (voucherRequest.getDiscountType().equals(percentageType) && voucherRequest.getPercentageAmount() != null) {
            voucher.percentageAmount(voucherRequest.getPercentageAmount());
            voucher.maximumDiscount(voucherRequest.getMaximumDiscount());
            voucher.isLimit(voucherRequest.getIsLimit());
            voucher.fixedAmount(null);
        }

        if (voucherRequest.getStartDate().isAfter(LocalDateTime.now())) {
            voucher.status(StatusVoucherEnum.UPCOMING.value());
        } else if (voucherRequest.getStartDate().isBefore(LocalDateTime.now())
                && voucherRequest.getEndDate().isAfter(LocalDateTime.now())) {
            voucher.status(StatusVoucherEnum.ONGOING.value());
        } else if (voucherRequest.getEndDate().isBefore(LocalDateTime.now())) {
            voucher.status(StatusVoucherEnum.EXPIRE.value());
        }

        return voucher.build();
    }
}
