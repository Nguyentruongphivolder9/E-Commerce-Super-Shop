package com.project.supershop.features.rating.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RatingForUserResponse extends RatingResponse {
    private Boolean isVoteUseFull;
    private Integer countVote;
    private String variantName;
    private SellerFeedbackResponse sellerFeedback;
}
