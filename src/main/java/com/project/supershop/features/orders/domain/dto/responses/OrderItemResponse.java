package com.project.supershop.features.orders.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItemResponse {
    private String id;
    private String productId;
    private String productVariantId;
    private String imageUrl;
    private String productName;
    private String variantName;
    private Integer quantity;
    private Integer price;
}
