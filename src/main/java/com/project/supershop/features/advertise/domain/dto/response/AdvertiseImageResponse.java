package com.project.supershop.features.advertise.domain.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdvertiseImageResponse {
    private UUID id;
    private String imageUrl;

}
