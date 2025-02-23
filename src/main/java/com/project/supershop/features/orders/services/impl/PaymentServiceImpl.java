package com.project.supershop.features.orders.services.impl;

import com.project.supershop.config.VnPayConfig;
import com.project.supershop.features.cart.services.CartItemService;
import com.stripe.model.checkout.Session;
import com.project.supershop.features.orders.domain.dto.responses.PaymentResponse;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.repositories.OrderRepository;
import com.project.supershop.features.orders.services.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    private final CartItemService cartItemService;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(CartItemService cartItemService, OrderRepository orderRepository) {
        this.cartItemService = cartItemService;
        this.orderRepository = orderRepository;
    }

    public PaymentResponse createPaymentLink(Long totalAmount, List<Order> orders) throws StripeException {
        Stripe.apiKey = "sk_test_51PrM84LOMUk1QogVPVJPEEvpXcpcNzY1JrnVz6Gf7ySoPgERBjMZ20aqfEvIlHQzyGRVpXHqGgDi0bSYR1DIpWug00NCKASh4H";
        String paymentIntentId = "pi" + UUID.randomUUID().toString();
        SessionCreateParams params = SessionCreateParams
                .builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment/callback/" + "?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=00")
                .setCancelUrl("http://localhost:3000/payment/callback/" + "?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=01")
                .addLineItem( // Thêm một line item vào session
                        SessionCreateParams.LineItem.builder() // Sử dụng builder pattern
                                .setQuantity(1L) // Số lượng
                                .setPriceData( // Thông tin giá
                                        SessionCreateParams.LineItem.PriceData.builder() // Sử dụng builder pattern
                                                .setCurrency("vnd") // Loại tiền tệ
                                                .setUnitAmount(totalAmount) // Số tiền
                                                .setProductData( // Thông tin sản phẩm
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder() // Sử dụng builder pattern
                                                                .setName("Orders") // Tên sản phẩm
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params); // Tạo session mới

        // Lưu paymentIntentId vào Order
        for (Order order : orders) {
            order.setPaymentIntentId(paymentIntentId);
            order.setRefundPaymentIntentId(session.getPaymentIntent());
            orderRepository.save(order);
        }

        PaymentResponse res = new PaymentResponse();
        res.setPaymentUrl(session.getUrl()); // Set url cho payment response

        return res; // Trả về payment response

    }


    @Override
    public PaymentResponse createPaymentLinkMobile(Long totalAmount, List<Order> orders) throws StripeException {
        Stripe.apiKey = "sk_test_51PrM84LOMUk1QogVPVJPEEvpXcpcNzY1JrnVz6Gf7ySoPgERBjMZ20aqfEvIlHQzyGRVpXHqGgDi0bSYR1DIpWug00NCKASh4H";
        String paymentIntentId = "pi" + UUID.randomUUID().toString();
        SessionCreateParams params = SessionCreateParams
                .builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://payment-callback" + "?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=00")
                .setCancelUrl("http://payment/callback" + "?paymentIntentId=" + paymentIntentId + "&stripeResponseCode=01")
                .addLineItem( // Thêm một line item vào session
                        SessionCreateParams.LineItem.builder() // Sử dụng builder pattern
                                .setQuantity(1L) // Số lượng
                                .setPriceData( // Thông tin giá
                                        SessionCreateParams.LineItem.PriceData.builder() // Sử dụng builder pattern
                                                .setCurrency("vnd") // Loại tiền tệ
                                                .setUnitAmount(totalAmount) // Số tiền
                                                .setProductData( // Thông tin sản phẩm
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder() // Sử dụng builder pattern
                                                                .setName("Orders") // Tên sản phẩm
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params); // Tạo session mới

        // Lưu paymentIntentId vào Order
        for (Order order : orders) {
            order.setPaymentIntentId(paymentIntentId);
            order.setRefundPaymentIntentId(session.getPaymentIntent());
            orderRepository.save(order);
        }

        PaymentResponse res = new PaymentResponse();
        res.setPaymentUrl(session.getUrl()); // Set url cho payment response

        return res; // Trả về payment response
    }


    @Override
    public PaymentResponse createPaymentUrlVnPay(Long totalAmount, List<Order> orders) {
        String vnp_Amount = String.valueOf(totalAmount * 100);
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String vnp_OrderInfo = URLEncoder.encode("Order: " + vnp_TxnRef, StandardCharsets.US_ASCII);


        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_Locale", VnPayConfig.vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
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
            if (fieldValue != null && fieldValue.length() > 0) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(VnPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        PaymentResponse paymentRes = new PaymentResponse();
        paymentRes.setPaymentUrl(paymentUrl);

        for (Order order : orders) {
            order.setVnpTxnRef(vnp_TxnRef);
            orderRepository.save(order);
        }

        return paymentRes;

    }

    public PaymentResponse createPaymentUrlCod(List<Order> orders, String jwtToken){
        List<String> cartItemIds = new ArrayList<>();
        orders.forEach(order ->
            order.getOrderItems().forEach(orderItem ->
                    cartItemIds.add(orderItem.getCartItemId())
            )
        );
        cartItemService.deleteCartItems(cartItemIds, jwtToken);
        PaymentResponse paymentRes = new PaymentResponse();
        String encodedPaymentMethod = URLEncoder.encode("cod", StandardCharsets.UTF_8);
        String fullUrl = "http://localhost:3000/payment/callback/" + "?paymentMethod=" + encodedPaymentMethod + "&codResponseCode=00";
        paymentRes.setPaymentUrl(fullUrl);
        return paymentRes;

    }

    @Override
    public String refundStripe(String paymentIntentId, Long amount) throws StripeException {
        Stripe.apiKey = "sk_test_51PrM84LOMUk1QogVPVJPEEvpXcpcNzY1JrnVz6Gf7ySoPgERBjMZ20aqfEvIlHQzyGRVpXHqGgDi0bSYR1DIpWug00NCKASh4H"; // Set api key cho Stripe

        RefundCreateParams params = RefundCreateParams
                .builder()
                .setAmount(1000L)
                .setPaymentIntent(paymentIntentId)
                .build();

        Refund refund = Refund.create(params);

        return refund.getStatus();
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
