package com.project.supershop.features.product.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.requests.ProductFavoriteRequest;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductFavorite;
import com.project.supershop.features.product.repositories.ProductFavoriteRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.services.ProductFavoriteService;
import com.project.supershop.handler.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ProductFavoriteServiceImpl implements ProductFavoriteService {
    private final ProductRepository productRepository;
    private final ProductFavoriteRepository productFavoriteRepository;
    private final JwtTokenService jwtTokenService;

    public ProductFavoriteServiceImpl(ProductRepository productRepository, ProductFavoriteRepository productFavoriteRepository, JwtTokenService jwtTokenService) {
        this.productRepository = productRepository;
        this.productFavoriteRepository = productFavoriteRepository;
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public void toggleLikeProduct(ProductFavoriteRequest request, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findByProductIdAndIsActiveOfProductOfShop(UUID.fromString(request.getProductId()), UUID.fromString(request.getShopId()), true);
        if(productOptional.isEmpty()) {
            throw new NotFoundException("Product not found with id: " + request.getProductId());
        }

        Optional<ProductFavorite> checkProductFavorite = productFavoriteRepository.findByProductIdAndAccountId(UUID.fromString(request.getProductId()), parseJwtToAccount.getId());
        if(checkProductFavorite.isEmpty()) {
            ProductFavorite productFavorite = ProductFavorite.likeProduct(productOptional.get(), parseJwtToAccount);
            productFavoriteRepository.save(productFavorite);
        } else {
            productFavoriteRepository.delete(checkProductFavorite.get());
        }
    }
}
