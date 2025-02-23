package com.project.supershop.features.rating.domain.dto.responses;

import com.project.supershop.features.account.domain.dto.response.UserInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RatingResponse {
    private String id;
    private String productId;
    private Integer ratingStar;
    private String productQuality;
    private String trueDescription;
    private String comment;
    private List<FeedbackImageResponse> feedbackImages;
    private UserInfoResponse account;
    private String createdAt;
    private String updatedAt;
}
