package com.project.supershop.features.orders.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentResponse {
    private String paymentUrl;
}
