package com.project.supershop.features.orders.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.orders.domain.dto.requests.OrderItemRequest;
import com.project.supershop.features.product.domain.entities.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "orderItem")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class OrderItem extends BaseEntity {
    private String cartItemId;
    private String imageUrl;
    private String productName;
    private String variantName;
    private String productId;
    private String productVariantId;
    private Integer quantity;
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "orderId")
    private Order order;

    public static OrderItem createOrderItem(OrderItemRequest orderItemRequest, Order order){
        return OrderItem.builder()
                .order(order)
                .cartItemId(orderItemRequest.getCartItemId())
                .imageUrl(orderItemRequest.getImageUrl())
                .productName(orderItemRequest.getProductName())
                .variantName(orderItemRequest.getVariantName())
                .productId(orderItemRequest.getProductId())
                .productVariantId(orderItemRequest.getProductVariantId())
                .quantity(orderItemRequest.getQuantity())
                .price(orderItemRequest.getPrice())
                .build();
    }
}
