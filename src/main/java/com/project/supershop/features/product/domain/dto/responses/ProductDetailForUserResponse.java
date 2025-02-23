package com.project.supershop.features.product.domain.dto.responses;

import com.project.supershop.features.account.domain.dto.response.SellerInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailForUserResponse extends ProductResponse {
    private Boolean isFavorite;
    private Boolean isProductOfShop;
    private SellerInfoResponse seller;
}
