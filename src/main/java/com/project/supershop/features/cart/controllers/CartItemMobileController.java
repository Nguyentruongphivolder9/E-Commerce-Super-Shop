package com.project.supershop.features.cart.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.cart.domain.dto.responses.CartItemResponse;
import com.project.supershop.features.cart.services.CartItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mobile/cart")
public class CartItemMobileController {

    private final CartItemService cartItemService;

    public CartItemMobileController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }
    @GetMapping
    public ResponseEntity<ResultResponse<List<CartItemResponse>>> getList(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        List<CartItemResponse> result = cartItemService.getListCartItemForMobile(jwtToken);
        ResultResponse<List<CartItemResponse>> response = ResultResponse.<List<CartItemResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get a successful shopping cart list.")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();
        return ResponseEntity.ok(response);
    }
}
