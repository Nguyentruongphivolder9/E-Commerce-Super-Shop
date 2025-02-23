package com.project.supershop.features.product.domain.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductVariantRequest {
    private String id;
    private Double price;
    private Integer stockQuantity;
    private String variantsGroup1Id;
    private String variant1Id;
    private String variantsGroup2Id;
    private String variant2Id;
}
