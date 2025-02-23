package com.project.supershop.features.voucher.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.voucher.domain.dto.requests.VoucherRequest;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.repositories.VoucherRepository;
import com.project.supershop.features.voucher.services.VoucherService;
import com.project.supershop.features.voucher.utils.enums.DiscountTypeEnum;
import com.project.supershop.features.voucher.utils.enums.StatusVoucherEnum;
import com.project.supershop.features.voucher.utils.jwtUltis.JwtAuthUtils;
import com.project.supershop.handler.ConflictException;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.utils.CheckTypeUUID;
import io.jsonwebtoken.Claims;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class VoucherServiceImpl implements VoucherService {
    private final JwtTokenService jwtTokenService;
    private final AccessTokenService accessTokenService;
    private final ModelMapper modelMapper;
    private final VoucherRepository voucherRepository;

    public VoucherServiceImpl(JwtTokenService jwtTokenService, AccountRepositories accountRepositories, JwtTokenService jwtTokenService1, AccessTokenService accessTokenService, ModelMapper modelMapper, VoucherRepository voucherRepository) {
        this.jwtTokenService = jwtTokenService1;
        this.accessTokenService = accessTokenService;
        this.modelMapper = modelMapper;
        this.voucherRepository = voucherRepository;
    }

    @Override
    public VoucherResponse createVoucher(VoucherRequest voucherRequest, String jwtToken) {
        Voucher voucher = Voucher.createVoucher(voucherRequest);
        Optional<Account> existingAccount = Optional.ofNullable(jwtTokenService.parseJwtTokenToAccount(jwtToken));
        existingAccount.map(account -> {
            if (!account.getRoleName().equalsIgnoreCase("admin")) {
                voucher.setAccount(account);
            }
            return account;
        });

        Optional<Voucher> voucherByCode = voucherRepository.findByCode(voucherRequest.getCode());
        if(voucherByCode.isPresent()){
            Voucher existingVoucher = voucherByCode.get();
            if(!existingVoucher.getStatus().equals(StatusVoucherEnum.EXPIRE.value())){
                throw new ConflictException("Duplicate voucher code, please use another one");
            }
        }

        Voucher voucherSaving = voucherRepository.save(voucher);
        TypeMap<Voucher, VoucherResponse> voucherResponseTypeMap = modelMapper.typeMap(Voucher.class, VoucherResponse.class)
                .addMappings(mapper -> {mapper.map(src -> src.getAccount().getId(), VoucherResponse::setShopId);
                });
        return modelMapper.map(voucherSaving, VoucherResponse.class);
    }

    @Override
    public VoucherResponse getVoucherById(String id) {
        return voucherRepository.findById(UUID.fromString(id))
                .map(voucher -> {
                    modelMapper.typeMap(Voucher.class, VoucherResponse.class).addMappings(mapper -> {
                        mapper.map(src -> src.getAccount().getId(), VoucherResponse::setShopId);
                    });
                    return modelMapper.map(voucher, VoucherResponse.class);
                })
                .orElseThrow(() -> new NotFoundException("Voucher not found with id: " + id));
    }

    @Override
    public Page<VoucherResponse> getVouchers(Pageable pageable, String jwtToken) {
        Account existingAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Page<Voucher> vouchers = voucherRepository.findAllByShopId(pageable, existingAccount.getId()); // shopId
        return vouchers.map(voucher -> {
            modelMapper.typeMap(Voucher.class, VoucherResponse.class).addMappings(mapper -> {
                mapper.map(src -> src.getAccount().getId(), VoucherResponse::setShopId);
            });
            return modelMapper.map(voucher, VoucherResponse.class);
        });
    }

    @Override
    public List<VoucherResponse> getVouchersByMultipleShopId(List<String> shopIds,String jwtToken) {
        Account existingAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        List<UUID> shopIdUuids = shopIds.stream()
                .map(id -> {
                    if (CheckTypeUUID.isValidUUID(id)) {
                        return UUID.fromString(id);
                    }
                    return null;
                })
                .filter(uuid -> uuid != null)
                .toList();

        List<Voucher> vouchers = voucherRepository.findVouchersByMultipleShopWithOngoing(shopIdUuids); // shopId

        return vouchers.stream()
                .map(voucher -> {
                    modelMapper.typeMap(Voucher.class, VoucherResponse.class).addMappings(mapper -> {
                        mapper.map(src -> src.getAccount().getId(), VoucherResponse::setShopId);
                    });
                    return modelMapper.map(voucher, VoucherResponse.class);
                })
                .toList();
    }

    @Override
    public VoucherResponse partialUpdate(String id, VoucherRequest voucherRequest) {

        return voucherRepository.findById(UUID.fromString(id))
                .map(existingVoucher -> {
                    String existingStatus = existingVoucher.getStatus();
                    if(existingStatus.equals(StatusVoucherEnum.ONGOING.value())){
                        if(voucherRequest.getDiscountType().equals(DiscountTypeEnum.FIXED.value()) || voucherRequest.getDiscountType().equals(DiscountTypeEnum.PERCENTAGE.value())){
                            Optional.ofNullable(voucherRequest.getName()).ifPresent(existingVoucher::setName);
                            Optional.ofNullable(voucherRequest.getQuantity()).ifPresent(existingVoucher::setQuantity);

                            if(Optional.ofNullable(voucherRequest.getIsEnd()).orElseGet(() -> false)) {
                                existingVoucher.setStatus(StatusVoucherEnum.EXPIRE.value());
                                Optional.ofNullable(voucherRequest.getEndDate()).ifPresent((endDate) -> existingVoucher.setEndDate(LocalDateTime.now()));
                            }else{
                                Optional.ofNullable(voucherRequest.getEndDate()).ifPresent(existingVoucher::setEndDate);
                            }
                        }
                    }

                    if(existingStatus.equals(StatusVoucherEnum.UPCOMING.value())){
                        Optional.ofNullable(voucherRequest.getName()).ifPresent(existingVoucher::setName);
                        Optional.ofNullable(voucherRequest.getMinimumTotalOrder()).ifPresent(existingVoucher::setMinimumTotalOrder);
                        Optional.ofNullable(voucherRequest.getMaxDistribution()).ifPresent(existingVoucher::setMaxDistribution);
                        Optional.ofNullable(voucherRequest.getStartDate()).ifPresent(existingVoucher::setStartDate);
                        Optional.ofNullable(voucherRequest.getEndDate()).ifPresent(existingVoucher::setEndDate);
                        Optional.ofNullable(voucherRequest.getQuantity()).ifPresent(existingVoucher::setQuantity);

                        //case same discountType
                        if(existingVoucher.getDiscountType().equals(voucherRequest.getDiscountType())){
                            if(voucherRequest.getDiscountType().equals(DiscountTypeEnum.FIXED.value())){
                                Optional.ofNullable(voucherRequest.getFixedAmount()).ifPresent(existingVoucher::setFixedAmount);

                            }
                            if(existingVoucher.getDiscountType().equals(voucherRequest.getDiscountType()) &&
                                    voucherRequest.getDiscountType().equals(DiscountTypeEnum.PERCENTAGE.value())){
                                Optional.ofNullable(voucherRequest.getPercentageAmount()).ifPresent(existingVoucher::setPercentageAmount);
                                Optional.ofNullable(voucherRequest.getIsLimit()).ifPresent(existingVoucher::setIsLimit);
                                Optional.ofNullable(voucherRequest.getMaximumDiscount()).ifPresent(existingVoucher::setMaximumDiscount);
                            }
                        }
                        // case not same discountType
                        if(!existingVoucher.getDiscountType().equals(voucherRequest.getDiscountType())){
                            if(voucherRequest.getDiscountType().equals(DiscountTypeEnum.PERCENTAGE.value())){
                                existingVoucher.setFixedAmount(null);
                                Optional.of(voucherRequest.getDiscountType()).ifPresent(existingVoucher::setDiscountType);
                                Optional.ofNullable(voucherRequest.getPercentageAmount()).ifPresent(existingVoucher::setPercentageAmount);
                                Optional.ofNullable(voucherRequest.getIsLimit()).ifPresent(existingVoucher::setIsLimit);
                                Optional.ofNullable(voucherRequest.getMaximumDiscount()).ifPresent(existingVoucher::setMaximumDiscount);
                            }

                            if(voucherRequest.getDiscountType().equals(DiscountTypeEnum.FIXED.value())){
                                Optional.of(voucherRequest.getDiscountType()).ifPresent(existingVoucher::setDiscountType);
                                Optional.ofNullable(voucherRequest.getFixedAmount()).ifPresent(existingVoucher::setFixedAmount);
                                existingVoucher.setPercentageAmount(null);
                                existingVoucher.setIsLimit(null);
                                existingVoucher.setMaximumDiscount(null);
                            }
                        }

                    }
                    voucherRepository.save(existingVoucher);
                    modelMapper.typeMap(Voucher.class, VoucherResponse.class).addMappings(mapper -> {
                        mapper.map(src -> src.getAccount().getId(), VoucherResponse::setShopId);
                    });
                    return modelMapper.map(existingVoucher, VoucherResponse.class);
                })
                .orElseThrow(() -> new NotFoundException("Voucher does not exist"));
    }

    @Override
    public void deleteVoucher(String id) {
        UUID idToDelete = UUID.fromString(id);
        boolean isExist = voucherRepository.existsById(idToDelete);
        if (!isExist) {
            throw new NotFoundException("Voucher does not exist");
        }
        voucherRepository.deleteById(idToDelete);
    }

    @Override
    public void autoExpireVoucher() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findVouchersToExpire(now);

        for (Voucher voucher : vouchers) {
            if (!voucher.getStatus().equals("expire")) {
                voucher.setStatus("expire");
                voucherRepository.save(voucher); //
            }
        }
    }
    @Override
    public void autoOngoingVoucher() {
        LocalDateTime now = LocalDateTime.now();
        // Tìm các voucher có startDate đã đến thời điểm hiện tại và trạng thái là 'upcoming'
        List<Voucher> vouchers = voucherRepository.findVouchersToStart(now);

        for (Voucher voucher : vouchers) {
            if (voucher.getStatus().equals("upcoming")) {
                voucher.setStatus("ongoing");
                voucherRepository.save(voucher); // Cập nhật voucher trong cơ sở dữ liệu
            }
        }
    }
}
