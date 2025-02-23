package com.project.supershop.features.orders.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "refunds")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Refund extends BaseEntity {

    private String shopId;
    private Double amount;
    private String reason;
    private String description;
    private String status;  // Enum can be used here
    private LocalDateTime refundDate;
    private String rejectedReason;
    @OneToMany(mappedBy = "refund", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<RefundItem> refundItems;

    @OneToMany(mappedBy = "refund", cascade = CascadeType.ALL,fetch = FetchType.LAZY , orphanRemoval = true)
    private List<RefundImages> refundImages;
    @ManyToOne
    @JoinColumn(name = "orderId", nullable = false)
    private Order order;
}
