package com.project.supershop.features.cart.services;

import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.cart.domain.dto.responses.CartItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CartItemService {
    CartItemResponse addCartItem(CartItemRequest cartItemRequest, String jwtToken);
    Page<CartItemResponse> getListCartItem(Pageable pageable, String jwtToken);
    CartItemResponse updateCartItem(CartItemRequest cartItemRequest, String jwtToken);
    CartItemResponse updateVariantCart(CartItemRequest itemRequest, String jwtToken);
    Integer deleteCartItems(List<String> listIdCartItem, String jwtToken);

    //Moblie
    List<CartItemResponse> getListCartItemForMobile(String jwtToken);
}
