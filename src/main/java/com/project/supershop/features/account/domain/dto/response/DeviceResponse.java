package com.project.supershop.features.account.domain.dto.response;


import com.project.supershop.features.account.utils.enums.DeviceTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class DeviceResponse {
    private UUID id;

    private String city;

    private String country;

    private String deviceFingerPrint;

    private String ipAddress;

    private String latitude;

    private String longitude;

    private String region;

    private String regionName;

    private String browserName;

    private DeviceTypeEnum  deviceType;

    private boolean isPrimary;

    private boolean isActive;

    private LocalDateTime assignedTime;

}
