package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.dto.requests.ProductRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Product extends BaseEntity {
    private String categoryId;
    private String name;
    private Double price;
    private Integer stockQuantity;
    @Column(length = 5000)
    private String description;
    private String conditionProduct;
    private String brand;
    private String status;
    private Boolean isVariant;
    private Boolean isActive;
    private Boolean isDeleted;

    @OneToMany(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private List<ProductImage> productImages;

    @OneToMany(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private List<VariantGroup> variantsGroup;

    @OneToMany(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private List<ProductVariant> productVariants;

    @OneToMany(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private List<HistoryViolation> historyViolations;

    @OneToMany(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private List<ShopProductsCategory> shopProductsCategories;

    @ManyToOne
    @JoinColumn(name = "shopId")
    private Account shop;

    @OneToOne(mappedBy = "product")
    @EqualsAndHashCode.Exclude
    private ProductFigure productFigure;

    public static Product createProduct(ProductRequest productRequest, String status, Account shop){
        return Product.builder()
                .shop(shop)
                .categoryId(productRequest.getCategoryId())
                .name(productRequest.getName())
                .price(productRequest.getPrice())
                .stockQuantity(productRequest.getStockQuantity())
                .conditionProduct(productRequest.getConditionProduct())
                .description(productRequest.getDescription())
                .brand(productRequest.getBrand())
                .status(status)
                .isVariant(productRequest.getIsVariant())
                .isActive(productRequest.getIsActive())
                .isDeleted(false)
                .build();
    }
}
