package com.project.supershop.features.advertise.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdvertiseRequest {

    @NotBlank(message = "name can not null")
    @Size(min = 1, max = 120, message = "Title must be between 1 and 120 characters")
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @NotNull(message = "Estimate banner can not null")
    private Long esBanner;

    @NotNull(message = "costBanner can not null")
    private Long costBanner;

    @NotNull(message = "Status can not null")
    private String status;

    private String paymentMethod;

    private MultipartFile[] imageFiles;

    private UUID shopId;


}
