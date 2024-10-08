package com.project.supershop.features.rating.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaginationRatingForUserResponse {
    private List<RatingForUserResponse> listRatings;
    private int totalPages;
}
