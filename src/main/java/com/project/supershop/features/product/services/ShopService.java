package com.project.supershop.features.product.services;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.product.domain.dto.responses.ProductPagination;
import com.project.supershop.features.product.domain.dto.responses.ShopDetailResponse;

public interface ShopService {
    ShopDetailResponse getShopDetail(String shopId);
    ProductPagination getListProduct(QueryParameters queryParameters, String shopId);
}
