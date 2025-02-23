package com.project.supershop.features.orders.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RefundRequest {
    private String orderId;
    private String shopId;
    private Double amount;
    private String reason;
    private String description;
    private String status;

}
