package com.project.supershop.features.product.services;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.product.domain.dto.requests.DeleteProductsRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductRequest;
import com.project.supershop.features.product.domain.dto.requests.UpdateStatusRequest;
import com.project.supershop.features.product.domain.dto.responses.*;
import com.project.supershop.features.product.domain.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest productRequest, String jwtToken);
    ProductResponse updateProduct(ProductRequest productRequest, String jwtToken);
    ProductDetailForUserResponse getProductByIdForUser(String id, String shopId, String jwtToken);
    ProductResponse getProductByIdOfShop(String id, String shopId);
    ProductResponse getProductById(String id);
    List<ProductResponse> updateStatusListProduct(UpdateStatusRequest updateStatusRequest, String jwtToken);
    ListProductInfoOfShopResponse getListProductOfShop(QueryParameters queryParameters, String jwtToken);
    Page<ProductResponse> getListProductOfCategoryForUser(QueryParameters queryParameters);
    Page<ProductResponse> getListProductRecommendation(QueryParameters queryParameters, String jwtToken);
    ListProductInfoForAdminResponse getListProductForAdmin(QueryParameters queryParameters, String jwtToken);
    void listingProductsForSale(List<String> stringIds);

    // Mobile
    List<ProductResponse> getListProductRecommendationMobile(QueryParameters queryParameters, String jwtToken);
    List<ProductResponse> getListProductOfCategoryForUserMobile(QueryParameters queryParameters);
    void deleteListProduct(DeleteProductsRequest request, String jwtToken);
}
