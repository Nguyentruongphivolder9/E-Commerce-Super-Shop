package com.project.supershop.features.product.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import com.project.supershop.features.product.domain.dto.requests.TypeViolationRequest;
import com.project.supershop.features.product.domain.dto.responses.HistoryViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.TypeViolationResponse;
import com.project.supershop.features.product.services.ViolationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/violations")
public class ViolationController {
    final ViolationService productViolationService;

    public ViolationController(ViolationService productViolationService) {
        this.productViolationService = productViolationService;
    }
    @PostMapping(
            value = "/type",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<TypeViolationResponse>> createTypeViolation(
            @Valid @ModelAttribute TypeViolationRequest typeViolationRequest) {
        TypeViolationResponse result = productViolationService.createTypeViolation(typeViolationRequest);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<TypeViolationResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create type of violation successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }
    @GetMapping( value = "/type")
    public ResponseEntity<ResultResponse<List<TypeViolationResponse>>> getAllTypeViolation() {
        List<TypeViolationResponse> result = productViolationService.getAllTypeViolations();
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<TypeViolationResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get categories successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PutMapping(
            value = "/type",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<TypeViolationResponse>> updateTypeViolation(
            @Valid @ModelAttribute TypeViolationRequest typeViolationRequest) {
        TypeViolationResponse result = productViolationService.updateTypeViolation(typeViolationRequest);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<TypeViolationResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create type of violation successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping( value = "/type/delete-list")
    public ResponseEntity<ResultResponse<String>> deleteListTypeOfViolation(
            @RequestBody List<String> typeViolationIds) {
        productViolationService.deleteListTypeOfViolation(typeViolationIds);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Deleted successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Deleted successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping(
            value = "/product",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<List<HistoryViolationResponse>>> createViolationReportProduct(
            @Valid @RequestBody ProductViolationRequest productViolationRequest) {
        List<HistoryViolationResponse> result = productViolationService.createViolationReportProduct(productViolationRequest);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<HistoryViolationResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create violation report product successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping(value = "/product/{productId}")
    public ResponseEntity<ResultResponse<List<HistoryViolationResponse>>> getAllHistoryViolationOfProduct(@PathVariable("productId") String productId) {
        List<HistoryViolationResponse> result = productViolationService.getAllHistoryViolationOfProduct(productId);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<HistoryViolationResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get categories successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @DeleteMapping(value = "/product/{productId}")
    public ResponseEntity<ResultResponse> revocationOfViolations(@PathVariable("productId") String productId) {
        productViolationService.deleteAndRevocationOfViolations(productId);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.builder()
                        .body("Successful revocation of violations")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Successful revocation of violations")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping(value = "/history/shop")
    public ResponseEntity<ResultResponse<Page<ProductViolationResponse>>> getListProducstViolation(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        Page<ProductViolationResponse> result = productViolationService.getListProductsViolation(queryParameters, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<Page<ProductViolationResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get categories successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
