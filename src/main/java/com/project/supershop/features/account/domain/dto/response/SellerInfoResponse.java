package com.project.supershop.features.account.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SellerInfoResponse {
    private String id;
    private int ratingTotal;
    private int ratingResponse;
    private double ratingStar;
    private int productTotal;
    private int followerTotal;
    private int followingTotal;
    private String joinedDate;
    private UserInfoResponse account;
}
