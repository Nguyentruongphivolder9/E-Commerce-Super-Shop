package com.project.supershop.features.rating.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.rating.domain.dto.requests.SellerFeedbackRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "sellerFeedbacks")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class SellerFeedback extends BaseEntity {
    private String message;

    @OneToOne
    @JoinColumn(name = "ratingId")
    private Rating rating;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

    public static SellerFeedback createSellerFeedback(SellerFeedbackRequest request, Rating rating, Account account){
        return SellerFeedback.builder()
                .message(request.getMessage())
                .rating(rating)
                .account(account)
                .build();
    }
}
