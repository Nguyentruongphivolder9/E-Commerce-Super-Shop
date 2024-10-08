package com.project.supershop.features.product.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusProduct {
    UNLISTED("unlisted"),
    PENDING_APPROVAL("pending approval"),
    FOR_SALE("for sale"),
    TEMPORARILY_LOCKED("temporarily locked"),
    DELETE("delete");

    private final String value;

    public String value() {
        return this.value;
    }

    public static StatusProduct fromValue(String value) {
        for (StatusProduct status : StatusProduct.values()) {
            if (status.getValue().equalsIgnoreCase(value.trim())) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }
}
