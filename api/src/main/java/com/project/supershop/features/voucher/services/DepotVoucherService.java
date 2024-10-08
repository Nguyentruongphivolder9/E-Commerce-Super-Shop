package com.project.supershop.features.voucher.services;

import com.project.supershop.features.voucher.domain.dto.requests.DepotVoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.DepotVoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepotVoucherService {
    DepotVoucherResponse addVoucherToDepot(DepotVoucherRequest depotVoucherRequest, String jwtToken);
    Page<DepotVoucherResponse> getVouchersOnSpecificUser(Pageable pageable, String jwtToken);
}
