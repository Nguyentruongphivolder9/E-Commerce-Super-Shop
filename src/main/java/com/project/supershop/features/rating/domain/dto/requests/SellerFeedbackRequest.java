package com.project.supershop.features.rating.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SellerFeedbackRequest {
    private String ratingId;
    private String message;
}
