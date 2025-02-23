package com.project.supershop.features.product.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductInterest;
import com.project.supershop.features.product.repositories.ProductInterestRepository;
import com.project.supershop.features.product.services.ProductInterestService;
import com.project.supershop.features.product.services.ProductService;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.handler.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class ProductInterestServiceImpl implements ProductInterestService {
    private final ModelMapper modelMapper;
    private final ProductService productService;
    private final ProductInterestRepository productInterestRepository;
    private final JwtTokenService jwtTokenService;

    public ProductInterestServiceImpl(ModelMapper modelMapper, ProductService productService, ProductInterestRepository productInterestRepository, JwtTokenService jwtTokenService) {
        this.modelMapper = modelMapper;
        this.productService = productService;
        this.productInterestRepository = productInterestRepository;
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public void addProductToList(String productId, String shopId, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<ProductInterest> productInterestOptional = productInterestRepository.findProductInterestByAccountId(parseJwtToAccount.getId());

        ProductInterest productInterest;
        if (productInterestOptional.isEmpty()) {
            List<String> productListIds = new ArrayList<>();
            productListIds.add(productId);
            productInterest = ProductInterest.createProductInterest(productListIds, parseJwtToAccount);
        } else {
            productInterest = productInterestOptional.get();
            List<String> productListIds = productInterest.getProductListId();

            productListIds.remove(productId);
            productListIds.add(0, productId);

            if (productListIds.size() > 20) {
                productListIds = productListIds.subList(0, 20);
            }

            productInterest.setProductListId(productListIds);
        }
        productInterestRepository.save(productInterest);

    }

    @Override
    public List<ProductResponse> getListProductInterest(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        ProductInterest productInterest = productInterestRepository
                .findProductInterestByAccountId(parseJwtToAccount.getId())
                .orElseThrow(() -> new NotFoundException("Data not found."));

        List<String> productListIds = productInterest.getProductListId();
        List<ProductResponse> productResponses = new ArrayList<>();
        productListIds.removeIf(productId -> {
            ProductResponse productResponse = productService.getProductById(productId);
            if (productResponse == null || !productResponse.getIsActive() ||
                    !Objects.equals(productResponse.getStatus(), StatusProduct.FOR_SALE.getValue())) {
                return true;
            } else {
                productResponses.add(productResponse);
                return false;
            }
        });

        productInterest.setProductListId(productListIds);
        productInterestRepository.save(productInterest);

        return productResponses;
    }
}
