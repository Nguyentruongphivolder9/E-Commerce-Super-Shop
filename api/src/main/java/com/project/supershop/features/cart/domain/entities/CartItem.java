package com.project.supershop.features.cart.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductRequest;
import com.project.supershop.features.product.domain.entities.Category;
import com.project.supershop.features.product.domain.entities.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "cartItems")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class CartItem extends BaseEntity {
    private String productVariantId;
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

    public static CartItem createCartItem(CartItemRequest cartItemRequest, Product product, Account account){
        return CartItem.builder()
                .account(account)
                .product(product)
                .productVariantId(cartItemRequest.getProductVariantId())
                .quantity(cartItemRequest.getQuantity())
                .build();
    }
}
