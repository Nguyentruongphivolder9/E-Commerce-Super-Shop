package com.project.supershop.features.product.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.requests.DeleteProductsRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductRequest;
import com.project.supershop.features.product.domain.dto.requests.UpdateStatusRequest;
import com.project.supershop.features.product.domain.dto.responses.*;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.services.ProductInterestService;
import com.project.supershop.features.product.services.ProductService;
import com.project.supershop.handler.ForBiddenException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;
    private final JwtTokenService jwtTokenService;
    private final ProductInterestService productInterestService;

    public ProductController(ProductService productService, JwtTokenService jwtTokenService, ProductInterestService productInterestService) {
        this.productService = productService;
        this.jwtTokenService = jwtTokenService;
        this.productInterestService = productInterestService;
    }

    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse> createProduct(@Valid @RequestBody ProductRequest productRequest,
                                                        @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        ProductResponse result = productService.createProduct(productRequest, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create product successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @GetMapping("/{id}/shop/{shopId}")
    public ResponseEntity<ResultResponse<ProductDetailForUserResponse>> getProductForUser(
            @PathVariable("id") String id,
            @PathVariable("shopId") String shopId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        ProductDetailForUserResponse result = productService.getProductByIdForUser(id, shopId, jwtToken);
        productInterestService.addProductToList(result.getId(), result.getShopId(), jwtToken);
        ResultResponse<ProductDetailForUserResponse> response = ResultResponse.<ProductDetailForUserResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/shop/edit")
    public ResponseEntity<ResultResponse<ProductResponse>> getByIdForEdit(
            @PathVariable("id") String id,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        // chưa kiểm tra role
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        ProductResponse result = productService.getProductByIdOfShop(id, parseJwtToAccount.getId().toString());
        if(!parseJwtToAccount.getId().toString().equals(result.getShopId())){
            throw new ForBiddenException("Your account doesn't have permission to edit products from other shop");
        }
        ResultResponse<ProductResponse> response = ResultResponse.<ProductResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping(
            value = "/{id}/shop/edit",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<ProductResponse>> updateProduct(
            @Valid @RequestBody ProductRequest productRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        ProductResponse result = productService.updateProduct(productRequest, jwtToken);
        return ResponseEntity.ok().body(
                ResultResponse.<ProductResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Update product successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
  
    @PostMapping(
            value = "/shop/edit-status/list",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<List<ProductResponse>>> updateStatusListProduct(
            @Valid @RequestBody UpdateStatusRequest updateStatusRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        List<ProductResponse> result = productService.updateStatusListProduct(updateStatusRequest, jwtToken);
        return ResponseEntity.ok().body(
                ResultResponse.<List<ProductResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Update product successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/list-of-shop")
    public ResponseEntity<ResultResponse<ListProductInfoOfShopResponse>> getListProductOfShop(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        ListProductInfoOfShopResponse result = productService.getListProductOfShop(queryParameters, jwtToken);
        ResultResponse<ListProductInfoOfShopResponse> response = ResultResponse.<ListProductInfoOfShopResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list-for-user")
    public ResponseEntity<ResultResponse<Page<ProductResponse>>> getListProductOfCategoryForUser(
            @ModelAttribute QueryParameters queryParameters
    ) {
        Page<ProductResponse> result = productService.getListProductOfCategoryForUser(queryParameters);
        ResultResponse<Page<ProductResponse>> response = ResultResponse.<Page<ProductResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendation")
    public ResponseEntity<ResultResponse<Page<ProductResponse>>> getListProductRecommendation(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        Page<ProductResponse> result = productService.getListProductRecommendation(queryParameters, jwtToken);
        ResultResponse<Page<ProductResponse>> response = ResultResponse.<Page<ProductResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list-for-admin")
    public ResponseEntity<ResultResponse<ListProductInfoForAdminResponse>> getListProductForAdmin(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        ListProductInfoForAdminResponse result = productService.getListProductForAdmin(queryParameters, jwtToken);
        ResultResponse<ListProductInfoForAdminResponse> response = ResultResponse.<ListProductInfoForAdminResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping(
            value = "/listing-for-sale",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<String>> listProductForSale(
            @RequestBody List<String> stringIds) {
        productService.listingProductsForSale(stringIds);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Listing products for sale successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Listing products for sale successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping(
            value = "/shop/delete/list",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<String>> deleteListProductOfShop(
            @RequestBody DeleteProductsRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        productService.deleteListProduct(request, jwtToken);
        return ResponseEntity.ok().body(
                ResultResponse.<String>builder()
                        .body("Delete list product successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Delete list product successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
