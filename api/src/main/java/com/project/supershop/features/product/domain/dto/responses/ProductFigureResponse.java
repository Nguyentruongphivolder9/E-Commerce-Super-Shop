package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductFigureResponse {
    private Double ratingStar;
    private Integer sold;
    private Integer view;
    private Integer totalRatings;
    private Integer totalStars;
    private Integer totalFavorites;
}
