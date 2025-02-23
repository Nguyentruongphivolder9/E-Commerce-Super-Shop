package com.project.supershop.features.cart.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.cart.domain.dto.responses.CartItemResponse;
import com.project.supershop.features.cart.domain.entities.CartItem;
import com.project.supershop.features.cart.repositories.CartItemRepository;
import com.project.supershop.features.cart.services.CartItemService;
import com.project.supershop.features.product.domain.dto.responses.ProductDetailForAdminResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductVariant;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.repositories.ProductVariantRepository;
import com.project.supershop.features.product.services.ProductService;
import com.project.supershop.features.product.utils.ProductUtils;
import com.project.supershop.handler.ConflictException;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.utils.CheckTypeUUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartItemServiceImpl implements CartItemService {
    private final ModelMapper modelMapper;
    private final JwtTokenService jwtTokenService;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AccountRepositories accountRepository;
    public CartItemServiceImpl(ModelMapper modelMapper, JwtTokenService jwtTokenService, CartItemRepository cartItemRepository, ProductRepository productRepository, ProductVariantRepository productVariantRepository, AccountRepositories accountRepository) {
        this.modelMapper = modelMapper;
        this.jwtTokenService = jwtTokenService;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public CartItemResponse addCartItem(CartItemRequest cartItemRequest, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(cartItemRequest.getProductId()), UUID.fromString(cartItemRequest.getShopId()));

        if (productOptional.isEmpty() || !productOptional.get().getIsActive()) {
            throw new NotFoundException("Product does not exists or store owners who have not yet posted for sale.");
        }

        int quantityLimit =  Optional.ofNullable(productOptional.get().getStockQuantity()).orElseGet(() -> 0);
        if (cartItemRequest.getProductVariantId() != null && !cartItemRequest.getProductVariantId().isEmpty()) {
            Optional<ProductVariant> productVariantOptional = productVariantRepository.findProductVariantByIdAndProductId(UUID.fromString(cartItemRequest.getProductVariantId()), productOptional.get().getId());
            if (productVariantOptional.isEmpty()) {
                throw new NotFoundException("Product variant does not exists.");
            }
            quantityLimit = productVariantOptional.get().getStockQuantity();
        }

        Optional<CartItem> cartItemOptional = cartItemRepository.findCartItemByAccountIdAndProductId(parseJwtToAccount.getId(), UUID.fromString(cartItemRequest.getProductId()), cartItemRequest.getProductVariantId());
        CartItem cartItemResult;
        CartItem cartItem;
        int quantity;

        if (cartItemOptional.isEmpty() || !cartItemOptional.get().getProductVariantId().equals(cartItemRequest.getProductVariantId())) {
            quantity = cartItemRequest.getQuantity();
            if (quantity > quantityLimit) {
                cartItemRequest.setQuantity(quantityLimit);
            }
            cartItem = CartItem.createCartItem(cartItemRequest, productOptional.get(), parseJwtToAccount);
        } else {
            cartItem = cartItemOptional.get();
            quantity = cartItem.getQuantity() + cartItemRequest.getQuantity();
            if (quantity > quantityLimit) {
                quantity = quantityLimit;
            }
            cartItem.setQuantity(quantity);
            cartItem.setProductVariantId(cartItemRequest.getProductVariantId());
        }

        cartItemResult = cartItemRepository.save(cartItem);
        CartItemResponse cartItemResponse = modelMapper.map(cartItemResult, CartItemResponse.class);
        cartItemResponse.setProduct(mapProductToProductResponse(productOptional.get()));
        return cartItemResponse;
    }

    @Override
    public Page<CartItemResponse> getListCartItem(Pageable pageable, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updatedAt")
        );
        Page<CartItem> cartItems = cartItemRepository.findListCartItemByAccountId(sortedPageable, parseJwtToAccount.getId());
        if (cartItems.isEmpty()) {
            return Page.empty(sortedPageable);
        }

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        modelMapper.typeMap(CartItem.class, CartItemResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getProduct().getShop(), CartItemResponse::setShopInfo);
        });
        return cartItems.map(cartItem -> modelMapper.map(cartItem, CartItemResponse.class));
    }

    private ProductResponse mapProductToProductResponse(Product product) {
        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public CartItemResponse updateCartItem(CartItemRequest cartItemRequest, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(cartItemRequest.getProductId()), UUID.fromString(cartItemRequest.getShopId()));

        if (productOptional.isEmpty() || !productOptional.get().getIsActive()) {
            throw new NotFoundException("Product does not exists or store owners who have not yet posted for sale.");
        }

        int quantityLimit = Optional.ofNullable(productOptional.get().getStockQuantity()).orElseGet(() -> 0);
        if (cartItemRequest.getProductVariantId() != null && !cartItemRequest.getProductVariantId().isEmpty()) {
            Optional<ProductVariant> productVariantOptional = productVariantRepository.findProductVariantByIdAndProductId(UUID.fromString(cartItemRequest.getProductVariantId()), productOptional.get().getId());
            if (productVariantOptional.isEmpty()) {
                throw new NotFoundException("Product variant does not exists.");
            }
            quantityLimit = productVariantOptional.get().getStockQuantity();
        }

        Optional<CartItem> cartItemOptional = cartItemRepository.findCartItemByAccountIdAndProductId(parseJwtToAccount.getId(), UUID.fromString(cartItemRequest.getProductId()), cartItemRequest.getProductVariantId());
        if(cartItemOptional.isEmpty()){
            throw new NotFoundException("Item does not exist");
        }

        int quantityToUpdate =  cartItemRequest.getQuantity();
        cartItemOptional.get().setQuantity(Math.min(quantityToUpdate, quantityLimit));
        CartItem  cartItemResult = cartItemRepository.save(cartItemOptional.get());

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        modelMapper.typeMap(CartItem.class, CartItemResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getProduct().getShop(), CartItemResponse::setShopInfo);
        });
        return modelMapper.map(cartItemResult, CartItemResponse.class);
    }

    @Override
    public CartItemResponse updateVariantCart(CartItemRequest cartItemRequest, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(cartItemRequest.getProductId()), UUID.fromString(cartItemRequest.getShopId()));
        List<CartItem> listCartItem = cartItemRepository.findListCartItemByAccountId(parseJwtToAccount.getId());
        if (productOptional.isEmpty() || !productOptional.get().getIsActive()) {
            throw new NotFoundException("Product does not exist or store owners who have not yet posted for sale.");
        }
        if (cartItemRequest.getProductVariantId() != null && !cartItemRequest.getProductVariantId().isEmpty()) {
            Optional<ProductVariant> newProductVariantChosen= productVariantRepository.findProductVariantByIdAndProductId(UUID.fromString(cartItemRequest.getProductVariantId()), productOptional.get().getId());
            if (newProductVariantChosen.isEmpty()) {
                throw new NotFoundException("The product variant that you've chosen does not exist or is no longer available..");
            }
//            Neu trung ,Shopee làm hay hơn là cộng luôn vô cái productVariantId muốn đổi và xoá cái cũ đi.
            for (CartItem cartItem : listCartItem) {
                if (cartItem.getProductVariantId().equals(cartItemRequest.getProductVariantId())) {
                    throw new ConflictException("The selected product variant is already in the cart.");
                }
            }
        }
        CartItemResponse cartItemResponse = cartItemRepository.findById(UUID.fromString(cartItemRequest.getId()))
        .map(existedCartItem -> {
            if(!existedCartItem.getProduct().getIsActive()){
                throw new NotFoundException("The product is sold out or no longer available.");
            }
            existedCartItem.setProductVariantId(cartItemRequest.getProductVariantId());
            CartItem  cartItemResult = cartItemRepository.save(existedCartItem);

            return modelMapper.map(cartItemResult, CartItemResponse.class);
        }).orElseThrow(
            () -> new NotFoundException("The item is no longer available.")
        );
        return cartItemResponse;
    }


    @Override
    public Integer deleteCartItems(List<String> listIdCartItem, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Set<UUID> setIdCartItemConvert = listIdCartItem.stream()
                .map(id -> {
                    if (CheckTypeUUID.isValidUUID(id)) {
                        return UUID.fromString(id);
                    }
                    return null;
                })
                .filter(uuid -> uuid != null)
                .collect(Collectors.toSet());

        Integer amountCartItemToDelete = cartItemRepository.countAllByIdIn(setIdCartItemConvert);
        boolean isExistsAll = amountCartItemToDelete.equals(setIdCartItemConvert.size());
        if (!isExistsAll) {
            throw new NotFoundException("Some Ids are missing");
        }

        cartItemRepository.deteleMultipleCartByIdAndAccountId(setIdCartItemConvert, parseJwtToAccount.getId());
        return amountCartItemToDelete;
    }

    @Override
    public List<CartItemResponse> getListCartItemForMobile(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<CartItem> cartItems = cartItemRepository.findListCartItemByAccountId(parseJwtToAccount.getId());

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        modelMapper.typeMap(CartItem.class, CartItemResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getProduct().getShop(), CartItemResponse::setShopInfo);
        });

        return cartItems.stream().map(cartItem -> {
            CartItemResponse cartItemResponse  = modelMapper.map(cartItem, CartItemResponse.class);
            ProductResponse productResponse = modelMapper.map(ProductUtils.sortOrderInfoOfProduct(cartItem.getProduct()), ProductResponse.class);
            cartItemResponse.setProduct(productResponse);
            return cartItemResponse;
        }).toList();
    }
}
