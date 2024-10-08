package com.project.supershop.features.orders.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.orders.domain.dto.requests.OrderRequest;
import com.project.supershop.features.orders.domain.dto.responses.PaymentResponse;
import com.project.supershop.features.orders.services.OrderService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mobile/orders")
public class OrdersMobileController {
    private final OrderService orderService;

    public OrdersMobileController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/{paymentIntentId}")
    public ResponseEntity<ResultResponse<PaymentResponse>> placeOrders(
            @RequestBody List<OrderRequest> ordersRequest,
            @PathVariable("paymentIntentId") String paymentIntentId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) throws Exception {

        orderService.placeOrdersMobile(ordersRequest, paymentIntentId, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<PaymentResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Place orders successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED)
                        .build());
    }
}
