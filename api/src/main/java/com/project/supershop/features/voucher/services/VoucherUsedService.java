package com.project.supershop.features.voucher.services;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherUsedResponse;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VoucherUsedService {
    List<VoucherUsedResponse> getVouchersUsed(String jwtToken);
    VoucherUsed createVoucherUsed(Account account, Voucher voucher);
}
