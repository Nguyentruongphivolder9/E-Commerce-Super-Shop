package com.project.supershop.features.orders.services;

import com.project.supershop.features.orders.domain.dto.responses.PaymentResponse;
import com.project.supershop.features.orders.domain.entities.Order;
import com.stripe.exception.StripeException;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {
    PaymentResponse createPaymentLink(Long totalAmount, List<Order> orders) throws StripeException;
    PaymentResponse createPaymentUrlVnPay(Long totalAmount, List<Order> orders) throws UnsupportedEncodingException;
    PaymentResponse createPaymentUrlCod(List<Order> orders, String jwtToken);
    String refundStripe(String paymentIntentId, Long amount) throws  StripeException;

    // Mobile
    PaymentResponse createPaymentLinkMobile(Long totalAmount, List<Order> orders) throws StripeException;
}
