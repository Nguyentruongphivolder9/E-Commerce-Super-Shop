package com.project.supershop.features.voucher.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DepotVoucherResponse {
    private String code;
    private Integer quantity;
    private VoucherResponse voucher;
}
