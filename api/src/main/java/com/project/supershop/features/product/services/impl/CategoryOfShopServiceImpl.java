package com.project.supershop.features.product.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.requests.CategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductsCategoryOfShopRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryOfShopResponse;
import com.project.supershop.features.product.domain.entities.CategoryOfShop;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ShopProductsCategory;
import com.project.supershop.features.product.repositories.CategoryOfShopRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.repositories.ShopProductsCategoryRepository;
import com.project.supershop.features.product.services.CategoryOfShopService;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.handler.ConflictException;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryOfShopServiceImpl implements CategoryOfShopService {
    private final CategoryOfShopRepository categoryOfShopRepository;
    private final ModelMapper modelMapper;
    private final JwtTokenService jwtTokenService;
    private final FileUploadUtils fileUploadUtils;
    private final ProductRepository productRepository;
    private final ShopProductsCategoryRepository shopProductsCategoryRepository;

    public CategoryOfShopServiceImpl(CategoryOfShopRepository categoryOfShopRepository, ModelMapper modelMapper, JwtTokenService jwtTokenService, FileUploadUtils fileUploadUtils, ProductRepository productRepository, ShopProductsCategoryRepository shopProductsCategoryRepository) {
        this.categoryOfShopRepository = categoryOfShopRepository;
        this.modelMapper = modelMapper;
        this.jwtTokenService = jwtTokenService;
        this.fileUploadUtils = fileUploadUtils;
        this.productRepository = productRepository;
        this.shopProductsCategoryRepository = shopProductsCategoryRepository;
    }

    @Override
    public List<CategoryOfShopResponse> getListCategoryOfShopActiveByShopId(String shopId) {
        List<CategoryOfShop> categoryOfShops = categoryOfShopRepository.findActiveCategoriesWithProducts(shopId, StatusProduct.FOR_SALE.getValue());
        return categoryOfShops.stream()
                .map(category -> modelMapper.map(category, CategoryOfShopResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryOfShopResponse> getListCategoryActiveOfShopByShopId(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<CategoryOfShop> categoryOfShops = categoryOfShopRepository.findAllCategoryOfShopByShopId(parseJwtToAccount.getId().toString());
        return categoryOfShops.stream()
                .map(category -> modelMapper.map(category, CategoryOfShopResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryOfShopResponse createCategoryOfShop(CategoryOfShopRequest request, String jwtToken) throws IOException {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        Optional<CategoryOfShop> findByName = categoryOfShopRepository.findCategoryOfShopByName(request.getName(), parseJwtToAccount.getId().toString());
        if(findByName.isPresent() && request.getId().isEmpty()) {
            throw new ConflictException("Duplicate category name: " + request.getName());
        }

        String fileName = "";
        if(!request.getImageFile().isEmpty()) {
            fileName = fileUploadUtils.uploadFile(request.getImageFile(), "categories-of-shop");
        }
        CategoryOfShop buildCategoryOfShop;
        if(!request.getId().isEmpty()) {
            Optional<CategoryOfShop> categoryOfShopOptional = categoryOfShopRepository.findById(UUID.fromString(request.getId()));
            if(categoryOfShopOptional.isPresent()) {
                Optional<CategoryOfShop> findByNameForEdit = categoryOfShopRepository.findCategoryOfShopByNameForEdit(parseJwtToAccount.getId().toString(), request.getName(), categoryOfShopOptional.get().getId());
                if(findByNameForEdit.isPresent()) {
                    throw new ConflictException("Duplicate category name: " + request.getName());
                }
                buildCategoryOfShop = categoryOfShopOptional.get();
                buildCategoryOfShop.setName(request.getName());
                if(!request.getImageFile().isEmpty()) {
                    buildCategoryOfShop.setImageUrl(fileName);
                }
            } else {
                Optional<CategoryOfShop> findByNameOptional = categoryOfShopRepository.findCategoryOfShopByName(request.getName(), parseJwtToAccount.getId().toString());
                if(findByNameOptional.isPresent()) {
                    throw new ConflictException("Duplicate category name: " + request.getName());
                }
                buildCategoryOfShop = CategoryOfShop.createCategoryOfShop(request.getName(), fileName, parseJwtToAccount.getId().toString());
            }
        } else {
            buildCategoryOfShop = CategoryOfShop.createCategoryOfShop(request.getName(), fileName, parseJwtToAccount.getId().toString());
        }

        CategoryOfShop result = categoryOfShopRepository.save(buildCategoryOfShop);
        return modelMapper.map(result, CategoryOfShopResponse.class);
    }

    @Override
    public void addListProducts(ProductsCategoryOfShopRequest request, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<CategoryOfShop> categoryOfShopOptional = categoryOfShopRepository.findByIdAndShopId(UUID.fromString(request.getCategoryOfShopId()), parseJwtToAccount.getId().toString());
        if(categoryOfShopOptional.isEmpty()) {
            throw new NotFoundException("No data found with id: " + request.getCategoryOfShopId());
        }

        CategoryOfShop categoryOfShop = categoryOfShopOptional.get();
        List<ShopProductsCategory> shopProductsCategories = new ArrayList<>();
        if(request.getProductIds().isEmpty()) {
            throw new UnprocessableException("Product listings must not be blank");
        }

        for (String productId : request.getProductIds()) {
            Optional<Product> productOptional = productRepository.findByIdAndShopId(
                    UUID.fromString(productId),
                    parseJwtToAccount.getId(),
                    StatusProduct.FOR_SALE.getValue()
            );
            if(productOptional.isEmpty()) {
                return;
            }

            Optional<ShopProductsCategory> shopProductsCategoryOptional
                    = shopProductsCategoryRepository.findProductExistsInCategoryOfShop(
                            productOptional.get().getId(), categoryOfShop.getId());
            if(shopProductsCategoryOptional.isPresent()) {
                return;
            }

            ShopProductsCategory shopProductsCategory = ShopProductsCategory.createShopProductsCategory(productOptional.get(), categoryOfShop);
            shopProductsCategories.add(shopProductsCategory);
        }
        shopProductsCategoryRepository.saveAll(shopProductsCategories);
        categoryOfShop.setTotalProduct(categoryOfShop.getTotalProduct() + shopProductsCategories.size());
        categoryOfShopRepository.save(categoryOfShop);
    }

    @Override
    public void switchToggleDisplay(String categoryOfShopId, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<CategoryOfShop> categoryOfShopOptional = categoryOfShopRepository.findByIdAndShopId(UUID.fromString(categoryOfShopId), parseJwtToAccount.getId().toString());
        if(categoryOfShopOptional.isEmpty()) {
            throw new NotFoundException("No data found with id: " + categoryOfShopId);
        }

        CategoryOfShop categoryOfShop = categoryOfShopOptional.get();
        categoryOfShop.setIsActive(!categoryOfShop.getIsActive());
        categoryOfShopRepository.save(categoryOfShop);
    }
}
