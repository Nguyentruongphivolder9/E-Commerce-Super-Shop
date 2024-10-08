package com.project.supershop.features.product.services;

import com.project.supershop.features.product.domain.dto.requests.ProductFavoriteRequest;

public interface ProductFavoriteService {
    void toggleLikeProduct(ProductFavoriteRequest request, String jwtToken);
}
