package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailForShopResponse extends ProductResponse {
    private List<HistoryViolationResponse> historyViolations;
}
