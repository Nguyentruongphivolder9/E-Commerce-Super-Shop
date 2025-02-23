package com.project.supershop.features.voucher.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.voucher.domain.dto.requests.DepotVoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.DepotVoucherResponse;
import com.project.supershop.features.voucher.domain.entities.DepotVoucher;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.repositories.DepotVoucherRepository;
import com.project.supershop.features.voucher.repositories.VoucherRepository;
import com.project.supershop.features.voucher.services.DepotVoucherService;
import com.project.supershop.handler.NotFoundException;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class DepotVoucherServiceImpl implements DepotVoucherService {
    private final JwtTokenService jwtTokenService;
    private final ModelMapper modelMapper;
    private final DepotVoucherRepository depotVoucherRepository;
    private final VoucherRepository voucherRepository;
    public DepotVoucherServiceImpl(AccessTokenService accessTokenService, JwtTokenService jwtTokenService, ModelMapper modelMapper, DepotVoucherRepository depotVoucherRepository, VoucherRepository voucherRepository) {
        this.jwtTokenService = jwtTokenService;
        this.modelMapper = modelMapper;
        this.depotVoucherRepository = depotVoucherRepository;
        this.voucherRepository = voucherRepository;
    }

    @Override
    public DepotVoucherResponse addVoucherToDepot(DepotVoucherRequest depotVoucherRequest, String jwtToken) {
        Account existingAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Voucher> existingVoucher = voucherRepository.findByCode(depotVoucherRequest.getCode());
        Voucher voucher = existingVoucher
                .map(v -> {
                    LocalDateTime now = LocalDateTime.now();
                    if (v.getEndDate().isBefore(now)) {
                        throw new NotFoundException("This voucher has expired. It is no longer valid.");
                    }
                    return v;
                })
                .orElseThrow(() -> new NotFoundException("This voucher is no longer in use. It may have been removed."));

        DepotVoucher voucherInDepot = depotVoucherRepository.findByVoucherIdAndAccountId(voucher.getId(),existingAccount.getId()).
            map(vid -> {
                vid.setQuantity(vid.getQuantity() + 1);
                return depotVoucherRepository.save(vid);
        }).orElseGet(() -> {
            DepotVoucher newVoucherDepot = DepotVoucher.builder().quantity(1).voucher(voucher).
                                                                    account(existingAccount).build();
            return depotVoucherRepository.save(newVoucherDepot);
        });

        TypeMap<DepotVoucher, DepotVoucherResponse> depotVoucherResponseTypeMap = modelMapper.typeMap(DepotVoucher.class, DepotVoucherResponse.class)
                .addMappings(mapper -> {
                    mapper.<String>map(src -> src.getVoucher().getAccount().getId(), (dest,v) -> dest.getVoucher().setShopId(v));
                    mapper.map(src -> src.getVoucher().getCode(), DepotVoucherResponse::setCode);
                    mapper.map(DepotVoucher::getQuantity, DepotVoucherResponse::setQuantity);
                });
        return modelMapper.map(voucherInDepot, DepotVoucherResponse.class);
    }

    @Override
    public Page<DepotVoucherResponse> getVouchersOnSpecificUser(Pageable pageable, String jwtToken) {
        Account existingAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Page<DepotVoucher> listVoucherInDepot = depotVoucherRepository.findAllByAccountId(pageable, existingAccount.getId());
        return listVoucherInDepot.map(voucherDepot -> {
            modelMapper.typeMap(DepotVoucher.class, DepotVoucherResponse.class).addMappings(mapper -> {
                mapper.<String>map(src -> src.getVoucher().getAccount().getId(), (dest, v) -> dest.getVoucher().setShopId(v)); //map ShopId for information
                mapper.map(DepotVoucher::getVoucher, DepotVoucherResponse::setVoucher); //
                mapper.map(src -> src.getVoucher().getCode(), DepotVoucherResponse::setCode);
                mapper.map(DepotVoucher::getQuantity, DepotVoucherResponse::setQuantity);
            });
            return modelMapper.map(voucherDepot, DepotVoucherResponse.class);
        });
    }
}
