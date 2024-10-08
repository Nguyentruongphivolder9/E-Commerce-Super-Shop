package com.project.supershop.features.rating.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.orders.domain.entities.OrderItem;
import com.project.supershop.features.product.domain.entities.HistoryViolation;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductFigure;
import com.project.supershop.features.rating.domain.dto.requests.RatingRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "ratings")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Rating extends BaseEntity {
    private Integer ratingStar;
    private String productQuality;
    private String trueDescription;
    private String comment;

    @OneToOne
    @JoinColumn(name = "orderItemId")
    @EqualsAndHashCode.Exclude
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "productId")
    @EqualsAndHashCode.Exclude
    private Product product;

    @ManyToOne
    @JoinColumn(name = "accountId")
    @EqualsAndHashCode.Exclude
    private Account account;

    @OneToMany(mappedBy = "rating")
    @EqualsAndHashCode.Exclude
    private List<FeedbackImage> feedbackImages;

    @OneToOne(mappedBy = "rating")
    @EqualsAndHashCode.Exclude
    private SellerFeedback sellerFeedback;

    public static Rating createRating(RatingRequest ratingRequest, Account account, Product product, OrderItem orderItem){
        return Rating.builder()
                .ratingStar(ratingRequest.getRatingStar())
                .productQuality(ratingRequest.getProductQuality())
                .trueDescription(ratingRequest.getTrueDescription())
                .comment(ratingRequest.getComment())
                .orderItem(orderItem)
                .product(product)
                .account(account)
                .build();
    }
}
