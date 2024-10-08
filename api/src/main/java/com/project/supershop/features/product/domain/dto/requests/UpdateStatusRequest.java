package com.project.supershop.features.product.domain.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateStatusRequest {
    @NotEmpty(message = "listProductId must not be empty")
    private String[] listProductId;

    @NotNull(message = "isActive must not be null")
    private Boolean isActive;
}