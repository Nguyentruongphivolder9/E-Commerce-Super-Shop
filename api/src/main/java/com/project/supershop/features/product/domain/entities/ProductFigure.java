package com.project.supershop.features.product.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "productsFigure")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProductFigure {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "productId")
    private Product product;

    private Double ratingStar;
    private Integer sold;
    private Integer view;
    private Integer totalRatings;
    private Integer totalStars;
    private Integer totalFavorites;

    public static ProductFigure createProductFigure(Product product){
        return ProductFigure.builder()
                .product(product)
                .ratingStar(0.0)
                .sold(0)
                .view(0)
                .totalRatings(0)
                .totalStars(0)
                .totalFavorites(0)
                .build();
    }
}
