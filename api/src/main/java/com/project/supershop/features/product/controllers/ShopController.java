package com.project.supershop.features.product.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.requests.CategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import com.project.supershop.features.product.domain.dto.responses.*;
import com.project.supershop.features.product.services.CategoryOfShopService;
import com.project.supershop.features.product.services.ShopService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/")
public class ShopController {
    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("shop-detail/{shopId}")
    public ResponseEntity<ResultResponse<ShopDetailResponse>> getShopDetail(
            @PathVariable("shopId") String shopId
    ) {
        ShopDetailResponse result = shopService.getShopDetail(shopId);
        ResultResponse<ShopDetailResponse> response = ResultResponse.<ShopDetailResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Shop details retrieved successfully.")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("shop-detail/{shopId}/list-products")
    public ResponseEntity<ResultResponse<ProductPagination>> getListProducts(
            @ModelAttribute QueryParameters queryParameters,
            @PathVariable("shopId") String shopId
    ) {
        ProductPagination result = shopService.getListProduct(queryParameters, shopId);
        ResultResponse<ProductPagination> response = ResultResponse.<ProductPagination>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Product list retrieved successfully.")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
}
