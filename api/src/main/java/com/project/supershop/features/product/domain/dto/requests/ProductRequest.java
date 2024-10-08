package com.project.supershop.features.product.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRequest {
    private String id;
    private String name;
    private String shopId;
    private Double price;
    private Integer stockQuantity;
    private String conditionProduct;
    private String categoryId;
    private String description;
    private String brand;
    private Boolean isVariant;
    private Boolean isActive;

    private List<ProductImagesRequest> productImages;
    private List<ProductVariantRequest> productVariants;
    private List<VariantGroupRequest> variantsGroup;
}
