package com.project.supershop.features.product.domain.dto.responses;

import com.project.supershop.features.account.domain.dto.response.SellerInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShopDetailResponse {
    private SellerInfoResponse shopInfo;
    private List<ProductResponse> topSales;
    private List<CategoryOfShopResponse> categoryOfShop;
    private List<CategoryOfShopDecorationResponse> categoryOfShopDecoration;
}
