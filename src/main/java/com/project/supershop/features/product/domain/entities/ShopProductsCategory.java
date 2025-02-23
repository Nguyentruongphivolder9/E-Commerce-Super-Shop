package com.project.supershop.features.product.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "shopProductsCategory")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class ShopProductsCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "categoryOfShopId")
    @EqualsAndHashCode.Exclude
    private CategoryOfShop categoryOfShop;

    @ManyToOne
    @JoinColumn(name = "productId")
    @EqualsAndHashCode.Exclude
    private Product product;

    public static ShopProductsCategory createShopProductsCategory(Product product, CategoryOfShop category){
        return ShopProductsCategory.builder()
                .categoryOfShop(category)
                .product(product)
                .build();
    }
}
