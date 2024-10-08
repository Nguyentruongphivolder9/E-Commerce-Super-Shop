package com.project.supershop.features.account.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductFigure;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Seller extends BaseEntity {
    private Integer totalRating;
    private Integer ratingResponse;
    private Double totalStars;
    private Integer totalProduct;
    private Integer totalFollower;
    private Integer totalFollowing;
    private LocalDateTime joinedDate;

    @OneToOne
    @JoinColumn(name = "shopId")
    private Account account;

    public static Seller createProductFigure(Account account){
        return Seller.builder()
                .totalRating(0)
                .ratingResponse(0)
                .totalStars(0.0)
                .totalProduct(0)
                .totalFollower(0)
                .totalFollowing(0)
                .joinedDate(LocalDateTime.now())
                .account(account)
                .build();
    }
}
