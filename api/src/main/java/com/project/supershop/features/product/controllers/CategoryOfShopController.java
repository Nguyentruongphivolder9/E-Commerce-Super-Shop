package com.project.supershop.features.product.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.requests.CategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductsCategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryOfShopResponse;
import com.project.supershop.features.product.services.CategoryOfShopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
public class CategoryOfShopController {
    private final CategoryOfShopService categoryOfShopService;

    public CategoryOfShopController(CategoryOfShopService categoryOfShopService) {
        this.categoryOfShopService = categoryOfShopService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ResultResponse<List<CategoryOfShopResponse>>> getAllCategory(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        List<CategoryOfShopResponse> result = categoryOfShopService.getListCategoryActiveOfShopByShopId(jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<CategoryOfShopResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Retrieved categories of the shop successfully.")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping(
            value = "/categories",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<CategoryOfShopResponse>> createCategoryOfShop(
            @Valid @ModelAttribute CategoryOfShopRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        CategoryOfShopResponse result = categoryOfShopService.createCategoryOfShop(request, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<CategoryOfShopResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Category of the shop created successfully.")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @PutMapping(
            value = "/categories",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<CategoryOfShopResponse>> updateCategoryOfShop(
            @Valid @ModelAttribute CategoryOfShopRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        CategoryOfShopResponse result = categoryOfShopService.createCategoryOfShop(request, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<CategoryOfShopResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Category of shop updated successfully.")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping(
            value = "/categories/{categoryOfShopId}/display"
    )
    public ResponseEntity<ResultResponse<String>> updateCategoryOfShop(
            @PathVariable("categoryOfShopId") String categoryOfShopId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        categoryOfShopService.switchToggleDisplay(categoryOfShopId, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Successfully updated the display status of the category.")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Successfully updated the display status of the category.")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
    @PostMapping(
            value = "/categories/list-product/add"
    )
    public ResponseEntity<ResultResponse<String>> categoryOfShopAddListProduct(
            @Valid @RequestBody ProductsCategoryOfShopRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        categoryOfShopService.addListProducts(request, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Successfully added the list of products.")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Successfully added the list of products.")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
