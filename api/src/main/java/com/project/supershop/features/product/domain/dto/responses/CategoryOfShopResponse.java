package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryOfShopResponse {
    private String id;
    private String name;
    private String imageUrl;
    private Integer totalProduct;
    private Boolean isActive;
}
