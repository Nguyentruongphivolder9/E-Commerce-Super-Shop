package com.project.supershop.features.voucher.domain.dto.responses;

import com.project.supershop.features.account.domain.entities.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VoucherResponse {
    private String id;
    private String shopId;
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
}
