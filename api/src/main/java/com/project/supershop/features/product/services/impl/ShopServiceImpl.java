package com.project.supershop.features.product.services.impl;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.account.domain.dto.response.SellerInfoResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Seller;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.features.account.services.SellerService;
import com.project.supershop.features.product.domain.dto.responses.*;
import com.project.supershop.features.product.domain.entities.CategoryOfShop;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ShopProductsCategory;
import com.project.supershop.features.product.repositories.CategoryOfShopRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.repositories.ShopProductsCategoryRepository;
import com.project.supershop.features.product.services.CategoryOfShopService;
import com.project.supershop.features.product.services.ProductService;
import com.project.supershop.features.product.services.ShopService;
import com.project.supershop.features.product.utils.ProductUtils;
import com.project.supershop.features.product.utils.enums.ConditionProduct;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.utils.CheckTypeUUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShopServiceImpl implements ShopService {
    private final AccountService accountService;
    private final SellerService sellerService;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final CategoryOfShopService categoryOfShopService;
    private final CategoryOfShopRepository categoryOfShopRepository;
    private final ShopProductsCategoryRepository shopProductsCategoryRepository;
    private final ModelMapper modelMapper;

    public ShopServiceImpl(AccountService accountService, SellerService sellerService, ProductRepository productRepository, ProductService productService, CategoryOfShopService categoryOfShopService, CategoryOfShopRepository categoryOfShopRepository, ShopProductsCategoryRepository shopProductsCategoryRepository, ModelMapper modelMapper) {
        this.accountService = accountService;
        this.sellerService = sellerService;
        this.productRepository = productRepository;
        this.productService = productService;
        this.categoryOfShopService = categoryOfShopService;
        this.categoryOfShopRepository = categoryOfShopRepository;
        this.shopProductsCategoryRepository = shopProductsCategoryRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ShopDetailResponse getShopDetail(String shopId) {
        Account account = accountService.findAccountById(UUID.fromString(shopId));
        List<CategoryOfShopResponse> categoryOfShopResponses = categoryOfShopService.getListCategoryOfShopActiveByShopId(shopId);

        Seller seller = sellerService.findSellerByShopId(account.getId());
        SellerInfoResponse sellerInfoResponse = modelMapper.map(seller, SellerInfoResponse.class);

        Pageable pageableTopSales = PageRequest.of(0, 20);
        List<Product> topProducts = productRepository.findTop20ProductsBySales(StatusProduct.FOR_SALE.getValue(), pageableTopSales);

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        List<ProductResponse> productResponses = topProducts.stream()
                .map(product -> modelMapper.map(product, ProductResponse.class))
                .toList();

        List<CategoryOfShopDecorationResponse> decorationResponses = new ArrayList<>();
        List<CategoryOfShop> categoryOfShops = categoryOfShopRepository.findListCategoryOfShopDecoration(PageRequest.of(0, 3), account.getId().toString());

        for (CategoryOfShop category : categoryOfShops) {
            CategoryOfShopDecorationResponse response = modelMapper.map(category, CategoryOfShopDecorationResponse.class);

            List<ShopProductsCategory> shopProductsCategories = shopProductsCategoryRepository.findByCategoryOfShopId(PageRequest.of(0, 6), category.getId());
            List<ProductResponse> productResponseList = shopProductsCategories.stream()
                    .map(shopProductsCategory -> modelMapper.map(shopProductsCategory.getProduct(), ProductResponse.class))
                    .toList();

            response.setListProducts(productResponseList);
            decorationResponses.add(response);
        }

        List<CategoryOfShopResponse> categoryOfShopCalTotalProductsResponses = categoryOfShopResponses.stream()
                .filter(categoryOfShopResponse -> {
                    int count = shopProductsCategoryRepository.countActiveProducts(UUID.fromString(categoryOfShopResponse.getId()));
                    if (count > 0) {
                        categoryOfShopResponse.setTotalProduct(count);
                        return true;
                    }
                    return false;
                })
                .toList();

        ShopDetailResponse response = new ShopDetailResponse();
        response.setShopInfo(sellerInfoResponse);
        response.setCategoryOfShop(categoryOfShopCalTotalProductsResponses);
        response.setTopSales(productResponses);
        response.setCategoryOfShopDecoration(decorationResponses);

        return response;
    }
    @Override
    public ProductPagination getListProduct(QueryParameters queryParameters, String shopId) {
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;

        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String sortBy = queryParameters.getSort_by();
        Sort sort;

        if ("ctime".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(direction, "createdAt")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar"));
        } else if ("price".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction,
                            "COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price)")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar")); // Thay đổi ở đây
        } else if ("sold".equalsIgnoreCase(sortBy) || "sales".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "productFigure.sold")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar"));
        } else {
            sort = Sort.by(Sort.Direction.DESC, "productFigure.ratingStar");
        }


        Pageable sortedPageable = PageRequest.of(page, limit, sort);
        double ratingStart = ProductUtils.getRatingStart(queryParameters);

        UUID categoryOfShopId = null;
        if (queryParameters.getCategory() != null && !queryParameters.getCategory().isEmpty()) {
            boolean isUUID = CheckTypeUUID.isValidUUID(queryParameters.getCategory());
            categoryOfShopId = isUUID ? UUID.fromString(queryParameters.getCategory()) : null;
        }

        Page<Product> products = productRepository.findListProductShopDetail(
                sortedPageable,
                UUID.fromString(shopId),
                categoryOfShopId,
                ratingStart,
                StatusProduct.FOR_SALE.getValue());

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        List<ProductResponse> productResponses = products.stream()
                .map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class))
                .collect(Collectors.toList());
        ProductPagination productPagination = new ProductPagination();
        productPagination.setListProducts(productResponses);
        productPagination.setTotalPages(products.getTotalPages());
        return productPagination;
    }
}
