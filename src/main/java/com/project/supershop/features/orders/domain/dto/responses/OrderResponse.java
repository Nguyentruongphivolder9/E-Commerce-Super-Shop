package com.project.supershop.features.orders.domain.dto.responses;

import com.project.supershop.features.orders.domain.entities.OrderItem;
import com.project.supershop.features.orders.domain.entities.OrderTimeLine;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderResponse {
    private String id;
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private Double orderTotal;
    private String orderStatus;
    private String paymentMethod;
    private String comment;
    private ShopInfomation shopInfomation;
    private String voucherId;
    private VoucherResponse voucherUsed;
    private List<OrderItemResponse> orderItems;
    private List<OrderTimeLineResponse> orderTimeLines;
    private Boolean isAnyRefundProcessing;
    private Boolean isRating;
    private LocalDateTime expiredDateRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
