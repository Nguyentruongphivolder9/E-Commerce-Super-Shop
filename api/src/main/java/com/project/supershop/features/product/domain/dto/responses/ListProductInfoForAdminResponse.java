package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ListProductInfoForAdminResponse {
    private Page<ProductDetailForAdminResponse> listProduct;
    private List<String> listCategoryId;
}