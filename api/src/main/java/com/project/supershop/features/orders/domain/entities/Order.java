package com.project.supershop.features.orders.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Order extends BaseEntity {

    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private Double orderTotal;
    private String orderStatus;
    private String paymentMethod;
    private String comment;
    private String voucherId;
    private String shopId; // belongs to shop
    private String vnpTxnRef;
    private String paymentIntentId;
    private String refundPaymentIntentId;
    private Boolean isPaid;
    private String reasonCancel = "";
    private Boolean isRating;
    private LocalDateTime expiredDateRating;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account; // belongs to customer, user place order

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderTimeLine> orderTimelines;

    @OneToOne(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private VoucherUsed voucherUsed;

    @OneToMany(mappedBy = "order")
    private List<Refund> refunds;
}
