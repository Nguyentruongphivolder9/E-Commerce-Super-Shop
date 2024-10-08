package com.project.supershop.config;

import java.util.Random;

public class VnPayConfig {
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_ReturnUrl = "http://localhost:3000/payment/callback/";
    public static String vnp_TmnCode = "9AIS3AIV";
    public static String secretKey = "";
    public static String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    public static String vnp_Version =  "2.1.0";
    public static String vnp_Command = "pay";
    public static String vnp_Locale = "en";
    public static String vnp_CurrCode = "VND";
    public static String vnp_IpAddr = "127.0.0.1";
    public static String vnp_OrderType = "other";

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
