package com.project.supershop.features.advertise.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdsPaymentRespone {

    private String paymentUrl;
    private String statusCode; // "00" for success in VNPay, for example

}
