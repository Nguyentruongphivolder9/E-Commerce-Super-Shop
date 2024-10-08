package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "categoriesOfShop")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class CategoryOfShop extends BaseEntity {
    private String name;
    private String imageUrl;
    private Integer totalProduct;
    private Boolean isActive;
    private String shopId;

    @OneToMany
    @JoinColumn(name = "categoryOfShop")
    @EqualsAndHashCode.Exclude
    private List<ShopProductsCategory> shopProductsCategories;

    public static CategoryOfShop createCategoryOfShop(String name, String fileName, String shopId){
        return CategoryOfShop.builder()
                .name(name)
                .imageUrl(fileName)
                .totalProduct(0)
                .isActive(false)
                .shopId(shopId)
                .build();
    }
}
