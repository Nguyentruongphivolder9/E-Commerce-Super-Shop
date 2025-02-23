package com.project.supershop.features.advertise.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class BannerRespone {
    private UUID advertiseId;
    private UUID shopId;
    private List<AdvertiseImageResponse> advertiseImages ;
}
