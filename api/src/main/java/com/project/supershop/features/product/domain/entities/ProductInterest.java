package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.dto.requests.ProductVariantRequest;
import com.project.supershop.features.product.utils.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "productInterest")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class ProductInterest extends BaseEntity {
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "json")
    private List<String> productListId;

    @ManyToOne
    @JoinColumn(name = "shopId")
    private Account account;

    public static ProductInterest createProductInterest(List<String> productListIds, Account account){
        return ProductInterest.builder()
                .productListId(productListIds)
                .account(account)
                .build();
    }
}
