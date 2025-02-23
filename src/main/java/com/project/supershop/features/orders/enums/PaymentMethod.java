package com.project.supershop.features.orders.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PaymentMethod {
    VNPAY("vnpay"),
    STRIPE("stripe"),
    COD("cod");

    private final String value;

    public String value() {
        return this.value;
    }
}
