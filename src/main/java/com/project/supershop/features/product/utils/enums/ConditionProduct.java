package com.project.supershop.features.product.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ConditionProduct {
    NEW("new"),
    USED("used");

    private final String value;

    public String value() {
        return this.value;
    }

    public static ConditionProduct fromValue(String value) {
        for (ConditionProduct status : ConditionProduct.values()) {
            if (status.getValue().equalsIgnoreCase(value.trim())) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }
}
