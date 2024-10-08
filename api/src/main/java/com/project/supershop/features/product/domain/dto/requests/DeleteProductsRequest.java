package com.project.supershop.features.product.domain.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeleteProductsRequest {
    @NotEmpty(message = "listProductId must not be empty")
    private String[] listProductId;
}
