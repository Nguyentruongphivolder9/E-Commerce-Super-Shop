package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TypeViolationResponse {
    private String id;
    private String title;
    private int countViolation;
    private String createdAt;
    private String updatedAt;
}
