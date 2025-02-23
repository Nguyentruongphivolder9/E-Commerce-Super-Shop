package com.project.supershop.features.product.services;

import com.project.supershop.features.product.domain.dto.responses.ProductResponse;

import java.util.List;

public interface ProductInterestService {
    void addProductToList(String productId, String shopId, String jwtToken);

    List<ProductResponse> getListProductInterest(String jwtToken);
}
