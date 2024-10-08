package com.project.supershop.features.advertise.services;

import com.project.supershop.features.advertise.domain.dto.response.AdsPaymentRespone;
import com.project.supershop.features.advertise.domain.entities.Advertise;
import com.stripe.exception.StripeException;

import java.io.UnsupportedEncodingException;

public interface AdsPaymentService {
     AdsPaymentRespone createPaymentUrlVnPay(Long totalAmount, Advertise advertisements) throws UnsupportedEncodingException ;
    AdsPaymentRespone  createPaymentStripe(Long totalAmount, Advertise advertise) throws StripeException;
}
