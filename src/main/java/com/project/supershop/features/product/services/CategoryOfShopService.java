package com.project.supershop.features.product.services;

import com.project.supershop.features.product.domain.dto.requests.CategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductsCategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryOfShopResponse;

import java.io.IOException;
import java.util.List;

public interface CategoryOfShopService {
    List<CategoryOfShopResponse> getListCategoryOfShopActiveByShopId(String shopId);
    List<CategoryOfShopResponse> getListCategoryActiveOfShopByShopId(String jwtToken);
    CategoryOfShopResponse createCategoryOfShop(CategoryOfShopRequest request, String jwtToken) throws IOException;
    void addListProducts(ProductsCategoryOfShopRequest request, String jwtToken);
    void switchToggleDisplay(String categoryOfShopId, String jwtToken);
}
