package com.project.supershop.features.product.services;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import com.project.supershop.features.product.domain.dto.requests.TypeViolationRequest;
import com.project.supershop.features.product.domain.dto.responses.HistoryViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.TypeViolationResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ViolationService {
    List<HistoryViolationResponse> createViolationReportProduct(ProductViolationRequest formRequest);
    TypeViolationResponse createTypeViolation(TypeViolationRequest formRequest);
    TypeViolationResponse updateTypeViolation(TypeViolationRequest formRequest);
    List<TypeViolationResponse> getAllTypeViolations();
    void deleteListTypeOfViolation(List<String> typeOfViolationIds);
    List<HistoryViolationResponse> getAllHistoryViolationOfProduct(String productId);
    void deleteAndRevocationOfViolations(String productId);
    Page<ProductViolationResponse> getListProductsViolation(QueryParameters queryParameters, String jwtToken);
}
