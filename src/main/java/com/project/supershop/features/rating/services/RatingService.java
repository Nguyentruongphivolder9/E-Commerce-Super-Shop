package com.project.supershop.features.rating.services;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.rating.domain.dto.requests.RatingRequest;
import com.project.supershop.features.rating.domain.dto.responses.PaginationRatingForUserResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingFigureResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingForUserResponse;

import java.io.IOException;
import java.util.List;

public interface RatingService {
    void createRatings(RatingRequest ratingRequests, String jwtToken) throws IOException;
    RatingFigureResponse getRatingFigureForUser(String productId, String jwtToken);
    PaginationRatingForUserResponse getListRatingsForUser(QueryParameters queryParameters, String productId, String jwtToken);
}
