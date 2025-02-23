package com.project.supershop.features.orders.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "refundImages")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class RefundImages extends BaseEntity {
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refundId", nullable = false)
    private Refund refund;
}
