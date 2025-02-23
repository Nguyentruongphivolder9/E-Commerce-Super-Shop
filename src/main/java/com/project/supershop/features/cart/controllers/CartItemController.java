package com.project.supershop.features.cart.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.cart.domain.dto.responses.CartItemResponse;
import com.project.supershop.features.cart.services.CartItemService;
import com.project.supershop.features.product.domain.dto.requests.ProductRequest;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
public class CartItemController {
    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse> addCart(
            @Valid @RequestBody CartItemRequest cartItemRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        CartItemResponse result = cartItemService.addCartItem(cartItemRequest, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Successfully add a product to the cart list.")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @GetMapping
    public ResponseEntity<ResultResponse<Page<CartItemResponse>>> getList(
            Pageable pageable,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        Page<CartItemResponse> result = cartItemService.getListCartItem(pageable, jwtToken);
        ResultResponse<Page<CartItemResponse>> response = ResultResponse.<Page<CartItemResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get a successful shopping cart list.")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping
    ResponseEntity<ResultResponse<CartItemResponse>> updateCart(@RequestBody CartItemRequest cartItemRequest,
                                                                    @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                            required = false) String jwtToken){

        CartItemResponse cartItemResponse = cartItemService.updateCartItem(cartItemRequest, jwtToken);
        ResultResponse<CartItemResponse> response = ResultResponse.<CartItemResponse>builder()
                .body(cartItemResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Update cart item successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/productVariant")
    ResponseEntity<ResultResponse<CartItemResponse>> updateVariantCart(@RequestBody CartItemRequest cartItemRequest,
                                                                @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                                        required = false) String jwtToken){
        CartItemResponse cartItemResponse = cartItemService.updateVariantCart(cartItemRequest, jwtToken);
        ResultResponse<CartItemResponse> response = ResultResponse.<CartItemResponse>builder()
                .body(cartItemResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Update cart item successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    ResponseEntity<ResultResponse<Map<String, Integer>>> deleteCart(@RequestBody Map<String, List<String>> requestBody,
                                                 @RequestHeader(name = HttpHeaders.AUTHORIZATION,
                                                         required = false) String jwtToken){
        List<String> listIdCartItem = requestBody.get("listIdCartItem");
        Map<String, Integer> deleteCountObject = Map.of("deletedCount", cartItemService.deleteCartItems(listIdCartItem, jwtToken));
        ResultResponse<Map<String, Integer>> response = ResultResponse.<Map<String, Integer>>builder()
                .body(deleteCountObject)
                .timeStamp(LocalDateTime.now().toString())
                .message("Delete cart item successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

}
