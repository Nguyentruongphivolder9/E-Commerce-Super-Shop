package com.project.supershop.features.voucher.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusVoucherEnum {
    UPCOMING("upcoming"),
    ONGOING("ongoing"),
    EXPIRE("expire");

    private final String value;

    public String value() {
        return this.value;
    }
}

