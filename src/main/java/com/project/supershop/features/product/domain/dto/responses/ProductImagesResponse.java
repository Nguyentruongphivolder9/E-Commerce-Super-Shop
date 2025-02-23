package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductImagesResponse {
    private String id;
    private String imageUrl;
    private  Boolean isPrimary;
}
