package com.project.supershop.features.product.domain.dto.responses;

import com.project.supershop.features.account.domain.dto.response.UserInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailForAdminResponse extends ProductResponse {
    private List<HistoryViolationResponse> historyViolations;
    private UserInfoResponse shop;
}
