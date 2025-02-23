package com.project.supershop.features.orders.services;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.orders.domain.dto.requests.OrderRequest;
import com.project.supershop.features.orders.domain.dto.responses.OrderResponse;
import com.project.supershop.features.orders.domain.dto.responses.PaymentResponse;
import com.project.supershop.features.orders.domain.dto.responses.RefundResponse;
import com.project.supershop.features.orders.domain.dto.responses.VnpResponse;
import com.project.supershop.features.orders.domain.entities.Refund;
import com.stripe.exception.StripeException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface OrderService {
    PaymentResponse placeOrders(List<OrderRequest> ordersRequest, String jwtToken) throws UnsupportedEncodingException, StripeException;
    void rollBackVnPayOrder(String vnpTxnRef);
    void rollBackStripeOrder(String paymentIntentId);
    List<OrderResponse> getOrdersByAccountId(QueryParameters queryParameters , String jwt);
    List<OrderResponse> getOrdersByShopId(String jwt);
    Page<OrderResponse> getOrderByShopIdWithPaginate(QueryParameters queryParameters, String jwtToken);
    OrderResponse getOrderByOrderId(String orderId);
    // method nay cho user request Refund.
    RefundResponse refundOrder(String orderId, List<String> orderItemIds,
                                String shopId , String amount, String description, String reason,
                                List<MultipartFile> imageFiles, String jwtToken) throws IOException;
    List<RefundResponse> getRefundOrderByShop(String jwt);
    Page<RefundResponse> getRefundOrderByShopWithPaginate(QueryParameters queryParameters, String jwtToken);
    RefundResponse getRefundById(String refundId, String jwt);
    String refundStripe(String refundId) throws StripeException;
    void cancelOrder(String orderId);
    void confirmOrder(String orderId);

    //Mobile
    void placeOrdersMobile(List<OrderRequest> ordersRequest, String paymentIntentId, String jwtToken) throws UnsupportedEncodingException, StripeException;

}
