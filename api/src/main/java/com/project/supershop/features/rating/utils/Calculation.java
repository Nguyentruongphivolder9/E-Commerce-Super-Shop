package com.project.supershop.features.rating.utils;

public class Calculation {
    public static Double StarRatingCalculating(int totalRatings, int totalStars) {
        if (totalRatings == 0) {
            return 0.0;
        }
        double averageRating = (double) totalStars / totalRatings;
        return Math.round(averageRating * 10.0) / 10.0;
    }
}
