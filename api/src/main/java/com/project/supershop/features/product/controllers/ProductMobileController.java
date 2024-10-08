package com.project.supershop.features.product.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.services.ProductInterestService;
import com.project.supershop.features.product.services.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mobile/products")
public class ProductMobileController {
    private final ProductService productService;
    private final JwtTokenService jwtTokenService;
    private final ProductInterestService productInterestService;

    public ProductMobileController(ProductService productService, JwtTokenService jwtTokenService, ProductInterestService productInterestService) {
        this.productService = productService;
        this.jwtTokenService = jwtTokenService;
        this.productInterestService = productInterestService;
    }

    @GetMapping("/list-for-user")
    public ResponseEntity<ResultResponse<List<ProductResponse>>> getListProductOfCategoryForUser(
            @ModelAttribute QueryParameters queryParameters
    ) {
        List<ProductResponse> result = productService.getListProductOfCategoryForUserMobile(queryParameters);
        ResultResponse<List<ProductResponse>> response = ResultResponse.<List<ProductResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendation")
    public ResponseEntity<ResultResponse<List<ProductResponse>>> getListProductRecommendation(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        List<ProductResponse> result = productService.getListProductRecommendationMobile(queryParameters, jwtToken);
        ResultResponse<List<ProductResponse>> response = ResultResponse.<List<ProductResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

}
