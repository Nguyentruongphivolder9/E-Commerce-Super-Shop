package com.project.supershop.features.account.services.impl;

import com.project.supershop.features.account.domain.entities.Seller;
import com.project.supershop.features.account.repositories.SellerRepository;
import com.project.supershop.features.account.services.SellerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class SellerServiceImpl implements SellerService {
    private final SellerRepository sellerRepository;

    public SellerServiceImpl(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    @Override
    public Seller findSellerByShopId(UUID id) {
        return sellerRepository.findByShopId(id).orElseThrow(() -> new EntityNotFoundException("The account has not registered for the selling function."));
    }
}
