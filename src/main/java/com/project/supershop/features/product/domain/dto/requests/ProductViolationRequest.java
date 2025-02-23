package com.project.supershop.features.product.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductViolationRequest {
    private List<String> productId;
    private String status;
    private String typeViolationId;
    private String reasons;
    private String suggest;
    private LocalDateTime deadline;
}
