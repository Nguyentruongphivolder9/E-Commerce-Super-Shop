package com.project.supershop.features.rating.services;

import com.project.supershop.features.rating.domain.dto.requests.SellerFeedbackRequest;

public interface SellerFeedbackService {
    void createSellerFeedback(SellerFeedbackRequest formRequest, String jwtToken);
}
