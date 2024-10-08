package com.project.supershop.features.orders.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RefundItemResponse {
    private String id;
    private String refundId;
    private String orderItemId;
    private Integer refundQuantity;
    private OrderItemResponse orderItem;
}
