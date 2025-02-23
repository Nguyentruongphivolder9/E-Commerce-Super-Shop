package com.project.supershop.features.product.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.services.ProductInterestService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products-interest")
public class ProductInterestController {
    final ProductInterestService productInterestService;

    public ProductInterestController(ProductInterestService productInterestService) {
        this.productInterestService = productInterestService;
    }

    @GetMapping
    public ResponseEntity<ResultResponse<List<ProductResponse>>> getList(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        List<ProductResponse> result = productInterestService.getListProductInterest(jwtToken);
        ResultResponse<List<ProductResponse>> response = ResultResponse.<List<ProductResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get Product List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
}
