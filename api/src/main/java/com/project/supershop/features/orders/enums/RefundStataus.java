package com.project.supershop.features.orders.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RefundStataus {
    PROCESSING("processing"),
//    ACCEPTED("accepted"),
    REJECTED("rejected"),
    DONE("done"); // nghĩa là shop chất nhận hoàn tiền, và user nhận được tiền.

    private final String value;

    public String value() {
        return this.value;
    }

    public static boolean isValidRefundOrderStatus(String value) {
        for (RefundStataus status : RefundStataus.values()) {
            if (status.value().equals(value)) {
                return true;
            }
        }
        return false;
    }
}
