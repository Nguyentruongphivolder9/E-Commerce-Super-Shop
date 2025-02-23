package com.project.supershop.features.account.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DeviceTypeEnum {
    DESKTOP("Desktop"),
    MOBILE("Mobile"),
    TABLET("Tablet");

    private final String value;

    public String value() {
        return this.value;
    }
}
