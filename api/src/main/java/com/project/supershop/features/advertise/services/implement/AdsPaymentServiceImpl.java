package com.project.supershop.features.advertise.services.implement;

import com.project.supershop.config.VnPayConfig;
import com.project.supershop.features.advertise.domain.dto.response.AdsPaymentRespone;
import com.project.supershop.features.advertise.domain.entities.Advertise;
import com.project.supershop.features.advertise.services.AdsPaymentService;
import com.project.supershop.features.advertise.repository.AdvertiseRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.model.checkout.Session;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class AdsPaymentServiceImpl implements AdsPaymentService {

    @Autowired
    private AdvertiseRepository advertiseRepository;

    @Override
    public AdsPaymentRespone createPaymentUrlVnPay(Long totalAmount, Advertise advertisements) throws UnsupportedEncodingException {
        String vnp_Amount = String.valueOf(totalAmount * 100); // Amount should be in VND, multiplied by 100.
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String vnp_AdvertiseInfo = URLEncoder.encode("Advertise: " + vnp_TxnRef, StandardCharsets.UTF_8.toString());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_AdvertiseInfo);
        vnp_Params.put("vnp_Locale", VnPayConfig.vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:3000/shopchannel/portal/payment/advertise/callback/?adsId=" + advertisements.getId());
        vnp_Params.put("vnp_IpAddr", VnPayConfig.vnp_IpAddr);
        vnp_Params.put("vnp_CurrCode", VnPayConfig.vnp_CurrCode);
        vnp_Params.put("vnp_OrderType", VnPayConfig.vnp_OrderType);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String vnp_SecureHash = hmacSHA512(VnPayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(URLEncoder.encode(vnp_SecureHash, StandardCharsets.UTF_8.toString()));
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query.toString();

        AdsPaymentRespone paymentRes = new AdsPaymentRespone();
        paymentRes.setPaymentUrl(paymentUrl);

        return paymentRes;
    }

    @Override
    public AdsPaymentRespone createPaymentStripe(Long totalAmount, Advertise advertise) throws StripeException {
        Stripe.apiKey = "sk_test_51PrM84LOMUk1QogVPVJPEEvpXcpcNzY1JrnVz6Gf7ySoPgERBjMZ20aqfEvIlHQzyGRVpXHqGgDi0bSYR1DIpWug00NCKASh4H";

        String paymentIntentId = "pi_" + UUID.randomUUID();

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/shopchannel/portal/payment/advertise/callback/?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=00" + "&adsId=" + advertise.getId())
                .setCancelUrl("http://localhost:3000/shopchannel/portal/payment/advertise/callback/?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=01" + "&adsId=" + advertise.getId())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("vnd")
                                                .setUnitAmount(totalAmount) // Stripe expects amount in the smallest currency unit
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Advertisement Payment")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        // Create Stripe Checkout session
        Session session = Session.create(params);

        AdsPaymentRespone paymentRes = new AdsPaymentRespone();
        paymentRes.setPaymentUrl(session.getUrl());

        return paymentRes;

    }


    private String hmacSHA512(String secretKey, String data) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte b : hmacBytes) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to calculate HMAC-SHA-512", e);
        }
    }
}
