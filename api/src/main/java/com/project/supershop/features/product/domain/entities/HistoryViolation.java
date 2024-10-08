package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.joda.time.DateTime;

import java.time.LocalDateTime;

@Entity
@Table(name = "historyViolations")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class HistoryViolation extends BaseEntity {
    private String reasons;
    private String suggest;
    private LocalDateTime deadline;
    private Boolean isRepaired;
    private String prevStatus;

    @ManyToOne
    @JoinColumn(name = "typeViolationId")
    @EqualsAndHashCode.Exclude
    private TypeViolation typeViolation;

    @ManyToOne
    @JoinColumn(name = "productId")
    @EqualsAndHashCode.Exclude
    private Product product;

    public static HistoryViolation createHistoryViolation(ProductViolationRequest request, Product product, TypeViolation violation){
        return HistoryViolation.builder()
                .reasons(request.getReasons())
                .suggest(request.getSuggest())
                .deadline(request.getDeadline())
                .product(product)
                .isRepaired(false)
                .typeViolation(violation)
                .prevStatus(product.getStatus())
                .build();
    }
}
