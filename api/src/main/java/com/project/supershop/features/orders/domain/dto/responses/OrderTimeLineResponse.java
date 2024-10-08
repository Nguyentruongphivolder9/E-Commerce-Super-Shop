package com.project.supershop.features.orders.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderTimeLineResponse {
    private String orderStatus;
    private String description;
    private LocalDateTime timestamp;
}
