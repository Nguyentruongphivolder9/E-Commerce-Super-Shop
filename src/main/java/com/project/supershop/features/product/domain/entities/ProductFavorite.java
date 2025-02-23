package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "productsFavorite")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProductFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

    public static ProductFavorite likeProduct(Product product, Account account){
        return ProductFavorite.builder()
                .account(account)
                .product(product)
                .build();
    }
}
