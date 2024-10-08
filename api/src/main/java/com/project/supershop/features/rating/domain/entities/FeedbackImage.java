package com.project.supershop.features.rating.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "feedbackImages")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class FeedbackImage extends BaseEntity {
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "ratingId")
    private Rating rating;
    public static FeedbackImage createFeedbackImage(String fileName, Rating rating){
        return FeedbackImage.builder()
                .imageUrl(fileName)
                .rating(rating)
                .build();
    }
}
