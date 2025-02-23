package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PreviewImageResponse {
    private String id;
    private String imageUrl;
}
