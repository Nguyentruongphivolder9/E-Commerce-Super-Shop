package com.project.supershop.features.voucher.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.voucher.domain.dto.requests.VoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.features.voucher.services.VoucherService;
import com.project.supershop.features.voucher.utils.jwtUltis.JwtAuthUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class VoucherController {
    private final VoucherService voucherService;
    private final JwtAuthUtils jwtAuthUtils;

    public VoucherController(VoucherService voucherService, JwtAuthUtils jwtAuthUtils) {
        this.voucherService = voucherService;
        this.jwtAuthUtils = jwtAuthUtils;
    }

    @RequestMapping(value = "/vouchers", method = RequestMethod.POST)
    public ResponseEntity<ResultResponse<VoucherResponse>> createVoucher(@RequestBody VoucherRequest voucherRequest,
                                                                         @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                                 required = false) String jwtToken){

        VoucherResponse voucherResponse = voucherService.createVoucher(voucherRequest, jwtToken);
        ResultResponse<VoucherResponse> response = ResultResponse.<VoucherResponse>builder()
                .body(voucherResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Create voucher successfully")
                .statusCode(HttpStatus.CREATED.value())
                .status(HttpStatus.CREATED)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/vouchers/{id}", method = RequestMethod.GET)
    ResponseEntity<ResultResponse<VoucherResponse>> getVoucher(@PathVariable("id") String id,
                                                                  @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                          required = false) String jwtToken){

        VoucherResponse voucherResponse = voucherService.getVoucherById(id);
        ResultResponse<VoucherResponse> response = ResultResponse.<VoucherResponse>builder()
                .body(voucherResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get voucher successfully with id " + id)
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/vouchers", method = RequestMethod.GET)
    ResponseEntity<ResultResponse<Page<VoucherResponse>>> getVouchers(Pageable pageable, @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                       required = false) String jwtToken){

        Page<VoucherResponse> listVoucherRes = voucherService.getVouchers(pageable, jwtToken);
        ResultResponse<Page<VoucherResponse>> response = ResultResponse.<Page<VoucherResponse>>builder()
                .body(listVoucherRes)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/vouchers/multipleShop", method = RequestMethod.GET)
    ResponseEntity<ResultResponse<List<VoucherResponse>>> getVouchersByMultipleShopId(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION,
            required = false) String jwtToken,
            @RequestParam(name = "shopIds") List<String> shopIds
        ){
        List<VoucherResponse> listVoucherRes = voucherService.getVouchersByMultipleShopId(shopIds ,jwtToken);
        ResultResponse<List<VoucherResponse>> response = ResultResponse.<List<VoucherResponse>>builder()
                .body(listVoucherRes)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/vouchers/{id}", method = RequestMethod.PATCH)
    ResponseEntity<ResultResponse<VoucherResponse>> partialUpdateVoucher(@PathVariable("id") String id,
                                                               @RequestBody VoucherRequest voucherRequest,
                                                               @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                       required = false) String jwtToken){

        VoucherResponse voucherResponse = voucherService.partialUpdate(id, voucherRequest);
        ResultResponse<VoucherResponse> response = ResultResponse.<VoucherResponse>builder()
                .body(voucherResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Update voucher successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/vouchers/{id}", method = RequestMethod.DELETE)
    ResponseEntity<ResultResponse> deleteVoucher(@PathVariable("id") String id,
                                                               @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                       required = false) String jwtToken){

        voucherService.deleteVoucher(id);
        ResultResponse<Object> response = ResultResponse.builder()
                .timeStamp(LocalDateTime.now().toString())
                .message("Delete voucher successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
}
