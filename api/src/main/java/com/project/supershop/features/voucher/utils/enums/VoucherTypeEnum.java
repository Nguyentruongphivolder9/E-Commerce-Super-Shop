package com.project.supershop.features.voucher.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum VoucherTypeEnum {
    GLOBAL("global"),
    SHOP("shop"),
    SHIPPING("shipping");

    private final String value;

    public String value() {
        return this.value;
    }
}
