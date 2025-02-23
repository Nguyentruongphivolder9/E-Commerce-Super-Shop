package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryOfShopDecorationResponse {
    private String id;
    private String name;
    private List<ProductResponse> listProducts;
}
