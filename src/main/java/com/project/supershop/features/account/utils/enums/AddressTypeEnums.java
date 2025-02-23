package com.project.supershop.features.account.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AddressTypeEnums {
    HOME("HOME"),
    BUSINESS("BUSINESS"),
    BILLING("BILLING"),
    SHIPPING("SHIPPING");

    private final String value;

    public String value() {
        return this.value;
    }
}
