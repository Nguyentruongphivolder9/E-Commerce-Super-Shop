package com.project.supershop.features.rating.services;

public interface VoteUseFullService {
    void toggleLikeRating(String ratingId, String jwtToken);
}
