package com.project.supershop.features.cart.domain.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartItemRequest {
    private String id;
    @NotBlank(message = "Product ID cannot be blank")
    private String productId;

    @NotBlank(message = "Shop ID cannot be blank")
    private String shopId;

    private String productVariantId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
