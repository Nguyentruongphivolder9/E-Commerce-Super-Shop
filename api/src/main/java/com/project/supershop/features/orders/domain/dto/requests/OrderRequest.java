package com.project.supershop.features.orders.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderRequest {
    private String id;
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private Double orderTotal;
    private String orderStatus;
    private String paymentMethod;
    private String comment;
    private String shopId;
    private String shopName;
    private String voucherId;
    private Double voucherOffPrice;
    private List<OrderItemRequest> orderItems;
}
