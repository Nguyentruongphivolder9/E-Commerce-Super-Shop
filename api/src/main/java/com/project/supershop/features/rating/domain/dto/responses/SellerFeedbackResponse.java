package com.project.supershop.features.rating.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SellerFeedbackResponse {
    private String id;
    private String message;
    private String createdAt;
}
