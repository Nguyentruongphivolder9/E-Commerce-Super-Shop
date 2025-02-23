package com.project.supershop.features.voucher.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.voucher.domain.dto.requests.DepotVoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.DepotVoucherResponse;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.features.voucher.services.DepotVoucherService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class DepotVoucherController {

    private final DepotVoucherService depotVoucherService;

    public DepotVoucherController(DepotVoucherService depotVoucherService) {
        this.depotVoucherService = depotVoucherService;
    }

    @PostMapping("vouchers/depot")
    public ResponseEntity<ResultResponse<DepotVoucherResponse>> addVoucherToDepot (@RequestBody DepotVoucherRequest depotVoucherRequest,
                                                                                   @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                                           required = false) String jwtToken) {
        DepotVoucherResponse depotVoucherResponse = depotVoucherService.addVoucherToDepot(depotVoucherRequest, jwtToken);
        ResultResponse<DepotVoucherResponse> response = ResultResponse.<DepotVoucherResponse>builder()
                .body(depotVoucherResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Add to user's depot successfully")
                .statusCode(HttpStatus.CREATED.value())
                .status(HttpStatus.CREATED)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("vouchers/depot")
    ResponseEntity<ResultResponse<Page<DepotVoucherResponse>>> getVouchers(Pageable pageable,
                                                                           @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                                    required = false) String jwtToken){
        Page<DepotVoucherResponse> listVoucherRes = depotVoucherService.getVouchersOnSpecificUser(pageable ,jwtToken);
        ResultResponse<Page<DepotVoucherResponse>> response = ResultResponse.<Page<DepotVoucherResponse>>builder()
                .body(listVoucherRes)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
}