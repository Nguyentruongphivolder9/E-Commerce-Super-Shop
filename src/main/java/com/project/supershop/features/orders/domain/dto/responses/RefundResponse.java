package com.project.supershop.features.orders.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RefundResponse {
    private String id;
    private String shopId;
    private Double amount;
    private String reason;
    private String description;
    private String status;
    private LocalDateTime refundDate;
    private Map<String, String> user;
    private List<RefundItemResponse> refundItems;
    private List<RefundImagesResponse> refundImages;
}
