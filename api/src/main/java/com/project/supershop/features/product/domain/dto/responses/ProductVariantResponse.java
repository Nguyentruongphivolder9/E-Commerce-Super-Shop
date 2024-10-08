package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductVariantResponse {
    private String id;
    private Double price;
    private Integer stockQuantity;
    private Integer sold;
    private VariantResponse variant1;
    private VariantResponse variant2;
}
