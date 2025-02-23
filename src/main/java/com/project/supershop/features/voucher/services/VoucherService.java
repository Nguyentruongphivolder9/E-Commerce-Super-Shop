package com.project.supershop.features.voucher.services;

import com.project.supershop.features.voucher.domain.dto.requests.VoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;


public interface VoucherService {
    VoucherResponse createVoucher(VoucherRequest voucherRequest, String jwtToken);
    VoucherResponse getVoucherById(String id);
    Page<VoucherResponse> getVouchers(Pageable pageable, String jwtToken);
    List<VoucherResponse> getVouchersByMultipleShopId(List<String> shopIds,String jwtToken);
    VoucherResponse partialUpdate(String id, VoucherRequest voucherRequest);
    void deleteVoucher(String id);
    void autoExpireVoucher();
    void autoOngoingVoucher();
}
