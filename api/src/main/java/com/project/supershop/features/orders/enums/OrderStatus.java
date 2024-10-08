package com.project.supershop.features.orders.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum OrderStatus {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    DELIVERING("delivering"),
    COMPLETED("completed"),
    CANCELLED("cancelled"),
    REFUNDED("refunded");
    private final String value;

    public String value() {
        return this.value;
    }

    public static boolean isValidOrderStatus(String value) {
        for (OrderStatus status : OrderStatus.values()) {
            if (status.value().equals(value)) {
                return true;
            }
        }
        return false;
    }
}
