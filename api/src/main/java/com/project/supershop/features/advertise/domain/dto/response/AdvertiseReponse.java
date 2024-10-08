package com.project.supershop.features.advertise.domain.dto.response;

import com.project.supershop.features.account.domain.entities.Account;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdvertiseReponse  {

    private String id;
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private int esBanner;

    private String shopId;
    private String status;

    private int costBanner;

    private boolean payed;
    private boolean run;
    private boolean isDeleted;

    private List<AdvertiseImageResponse> advertiseImages;

    private int click;

}
