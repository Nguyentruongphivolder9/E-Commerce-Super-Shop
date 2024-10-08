package com.project.supershop.features.voucher.scheduler;

import com.project.supershop.features.voucher.services.VoucherService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
public class VoucherScheduler {
    private final VoucherService voucherService;

    public VoucherScheduler(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

//    @Scheduled(fixedRate = 1000)
//    public void autoExpireVoucherSchedule() {
//        voucherService.autoExpireVoucher();
//    }
//
//    @Scheduled(fixedRate = 1000)
//    public void autoOngoingVoucherSchedule() {
//        voucherService.autoOngoingVoucher();
//    }
}
