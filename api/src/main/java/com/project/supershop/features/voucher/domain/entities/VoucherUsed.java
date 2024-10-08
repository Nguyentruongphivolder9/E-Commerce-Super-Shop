package com.project.supershop.features.voucher.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.cart.domain.entities.CartItem;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.product.domain.entities.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "voucherUsed")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class VoucherUsed extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucherId")
    private Voucher voucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountId")
    private Account account;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", unique = true) // Đảm bảo rằng cột này là duy nhất
    private Order order;

    public static VoucherUsed createVoucherUsed(Account account, Voucher voucher, Order order){
        return VoucherUsed.builder()
                .account(account)
                .voucher(voucher)
                .order(order)
                .build();

    }
}
