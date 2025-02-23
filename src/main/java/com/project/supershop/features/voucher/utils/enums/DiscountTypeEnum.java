package com.project.supershop.features.voucher.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DiscountTypeEnum {
    FIXED("fixed"),
    PERCENTAGE("percentage");

    private final String value;

    public String value() {
        return this.value;
    }
}
