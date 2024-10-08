package com.project.supershop.features.cart.domain.dto.responses;

import com.project.supershop.features.account.domain.dto.response.AccountResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductVariantResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartItemResponse {
    private String id;
    private Integer quantity;
    private String productVariantId;
    private ProductResponse product;
    private ShopInformation shopInfo;
    private String createdAt;
    private String updatedAt;
}
