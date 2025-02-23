package com.project.supershop.features.orders.domain.entities;

import com.project.supershop.common.BaseEntity;
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
@Table(name = "orderTimeLine")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class OrderTimeLine extends BaseEntity {

    private String description;
    private LocalDateTime timestamp;
    @ManyToOne
    @JoinColumn(name = "orderId")
    private Order order;
}
