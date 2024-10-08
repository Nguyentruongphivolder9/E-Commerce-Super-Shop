package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductResponse {
    private String id;
    private String shopId;
    private String categoryId;
    private String name;
    private Double price;
    private Integer stockQuantity;
    private String description;
    private String conditionProduct;
    private Boolean isVariant;
    private Boolean isActive;
    private Boolean isDeleted;
    private String brand;
    private String status;
    private List<ProductImagesResponse> productImages;
    private List<VariantGroupResponse> variantsGroup;
    private List<ProductVariantResponse> productVariants;
    private ProductFigureResponse productFigure;
    private String createdAt;
    private String updatedAt;
}
