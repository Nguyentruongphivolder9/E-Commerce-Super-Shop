package com.project.supershop.features.account.services;

import com.project.supershop.features.account.domain.entities.Seller;

import java.util.UUID;

public interface SellerService {
    Seller findSellerByShopId(UUID id);
}
