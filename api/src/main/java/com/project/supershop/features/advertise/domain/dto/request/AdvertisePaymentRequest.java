package com.project.supershop.features.advertise.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdvertisePaymentRequest {
    private UUID adsId;
    private String status;
    private boolean payed;
}
