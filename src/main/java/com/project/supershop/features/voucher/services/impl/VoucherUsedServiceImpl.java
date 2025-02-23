package com.project.supershop.features.voucher.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.voucher.domain.dto.responses.DepotVoucherResponse;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherUsedResponse;
import com.project.supershop.features.voucher.domain.entities.DepotVoucher;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import com.project.supershop.features.voucher.repositories.VoucherUsedRepository;
import com.project.supershop.features.voucher.services.VoucherUsedService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class VoucherUsedServiceImpl implements VoucherUsedService {

    private final JwtTokenService jwtTokenService;
    private final ModelMapper modelMapper;
    private final VoucherUsedRepository voucherUsedRepository;
    public VoucherUsedServiceImpl(AccessTokenService accessTokenService, JwtTokenService jwtTokenService, ModelMapper modelMapper, VoucherUsedRepository voucherUsedRepository) {
        this.jwtTokenService = jwtTokenService;
        this.modelMapper = modelMapper;
        this.voucherUsedRepository = voucherUsedRepository;
    }

    @Override
    public List<VoucherUsedResponse> getVouchersUsed(String jwtToken) {
        Account existingAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<VoucherUsed> listVoucherUsed = voucherUsedRepository.findAllByAccountId(existingAccount.getId());
        return listVoucherUsed.stream().map(voucherUsed -> {
            modelMapper.typeMap(VoucherUsed.class, VoucherUsedResponse.class).addMappings(mapper -> {
                mapper.<String>map(src -> src.getVoucher().getAccount().getId(), (dest,v) -> dest.getVoucher().setShopId(v)); // map ShopId for information
                mapper.map(VoucherUsed::getVoucher, VoucherUsedResponse::setVoucher); // map Voucher object luôn
                mapper.map(src -> src.getOrder().getId(), VoucherUsedResponse::setOrderId);
            });
            return modelMapper.map(voucherUsed, VoucherUsedResponse.class);
        }).toList();
    }

    @Override
    public VoucherUsed createVoucherUsed(Account account, Voucher voucher) {
        VoucherUsed voucherUsed = new VoucherUsed();
        voucherUsed.setAccount(account);
        voucherUsed.setVoucher(voucher);
        return voucherUsed;
    }
}
