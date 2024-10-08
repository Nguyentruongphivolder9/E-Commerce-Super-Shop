package com.project.supershop.features.orders.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.cart.domain.dto.requests.CartItemRequest;
import com.project.supershop.features.cart.domain.dto.responses.CartItemResponse;
import com.project.supershop.features.cart.services.CartItemService;
import com.project.supershop.features.orders.domain.dto.requests.OrderRequest;
import com.project.supershop.features.orders.domain.dto.responses.*;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.domain.entities.OrderItem;
import com.project.supershop.features.orders.domain.entities.RefundImages;
import com.project.supershop.features.orders.repositories.OrderItemRepository;
import com.project.supershop.features.orders.repositories.OrderRepository;
import com.project.supershop.features.orders.repositories.RefundImagesRepository;
import com.project.supershop.features.orders.services.OrderItemService;
import com.project.supershop.features.orders.services.OrderService;
import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.services.FileUploadUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrdersController {
    private final FileUploadUtils fileUploadUtils;
    private final OrderService orderService;
    private final OrderItemRepository orderItemRepository;
    private final OrderItemService orderItemService;
    private final OrderRepository orderRepository;
    private final CartItemService cartItemService;
    private final RefundImagesRepository refundImagesRepository;
    public OrdersController(FileUploadUtils fileUploadUtils, OrderService orderService, OrderItemRepository orderItemRepository, OrderItemService orderItemService, OrderRepository orderRepository, CartItemService cartItemService, RefundImagesRepository refundImagesRepository) {
        this.fileUploadUtils = fileUploadUtils;
        this.orderService = orderService;
        this.orderItemRepository = orderItemRepository;
        this.orderItemService = orderItemService;
        this.orderRepository = orderRepository;
        this.cartItemService = cartItemService;
        this.refundImagesRepository = refundImagesRepository;
    }

    @PostMapping
    public ResponseEntity<ResultResponse<PaymentResponse>> placeOrders(
            @RequestBody List<OrderRequest> ordersRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) throws Exception {

        PaymentResponse result = orderService.placeOrders(ordersRequest, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<PaymentResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Place orders successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED)
                        .build());
    }
//
    @GetMapping
    ResponseEntity<ResultResponse<List<OrderResponse>>> getOrdersByAccountId(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION,required = false) String jwtToken ,
            @ModelAttribute QueryParameters queryParameters){
        List<OrderResponse> orders =orderService.getOrdersByAccountId(queryParameters,jwtToken);
        ResultResponse<List<OrderResponse>> response = ResultResponse.<List<OrderResponse>>builder()
                .body(orders)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List orders successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/shop")
    ResponseEntity<ResultResponse<List<OrderResponse>>> getOrdersByShopId(@RequestHeader(name = HttpHeaders.AUTHORIZATION,
            required = false) String jwtToken){

        List<OrderResponse> orders =orderService.getOrdersByShopId(jwtToken);
        ResultResponse<List<OrderResponse>> response = ResultResponse.<List<OrderResponse>>builder()
                .body(orders)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List shop orders successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    ResponseEntity<ResultResponse<OrderResponse>> getOrdersByOrderId(@RequestHeader(name = HttpHeaders.AUTHORIZATION,
            required = false) String jwtToken, @PathVariable("orderId") String orderId){

        OrderResponse order =orderService.getOrderByOrderId(orderId);
        ResultResponse<OrderResponse> response = ResultResponse.<OrderResponse>builder()
                .body(order)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get order successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/shop/paginate")
    ResponseEntity<ResultResponse<Page<OrderResponse>>> getOrdersByShopIdWithPaginate(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken){

        Page<OrderResponse> orders =orderService.getOrderByShopIdWithPaginate(queryParameters,jwtToken);
        ResultResponse<Page<OrderResponse>> response = ResultResponse.<Page<OrderResponse>>builder()
                .body(orders)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List shop orders successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/shop/refunds/paginate")
    ResponseEntity<ResultResponse<Page<RefundResponse>>> getRefundOrderByShopIdWithPaginate(
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken){

        Page<RefundResponse> orders =orderService.getRefundOrderByShopWithPaginate(queryParameters,jwtToken);
        ResultResponse<Page<RefundResponse>> response = ResultResponse.<Page<RefundResponse>>builder()
                .body(orders)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get refund orders successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/shop/refunds")
    ResponseEntity<ResultResponse<List<RefundResponse>>> getRefundOrderByShopId(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken){

        List<RefundResponse> refundOrders = orderService.getRefundOrderByShop(jwtToken);
        ResultResponse<List<RefundResponse>> response = ResultResponse.<List<RefundResponse>>builder()
                .body(refundOrders)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get refundOrders successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/refund/{refundId}")
    ResponseEntity<ResultResponse<RefundResponse>> getRefundById(@RequestHeader(name = HttpHeaders.AUTHORIZATION,
            required = false) String jwtToken, @PathVariable("refundId") String refundId){

        RefundResponse refund = orderService.getRefundById(refundId, jwtToken);
        ResultResponse<RefundResponse> response = ResultResponse.<RefundResponse>builder()
                .body(refund)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get order successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/refunds",consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResultResponse> createRefundOrder(@RequestHeader(name = HttpHeaders.AUTHORIZATION,required = false) String jwtToken,
                                                      @RequestParam("orderId") String orderId,
                                                      @RequestParam("orderItemIds") List<String> orderItemIds,
                                                      @RequestParam("shopId") String shopId,
                                                      @RequestParam("amount") String amount,
                                                      @RequestParam("description") String description,
                                                       @RequestParam("reason") String reason,
                                                       @RequestParam("imageFiles") List<MultipartFile> imageFiles) throws IOException {
        RefundResponse result = orderService.refundOrder(orderId, orderItemIds ,shopId, amount, description, reason, imageFiles, jwtToken);
        ResultResponse<RefundResponse> response = ResultResponse.<RefundResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get order successfully")
                .statusCode(HttpStatus.CREATED.value())
                .status(HttpStatus.CREATED)
                .build();

        return ResponseEntity.ok(response);
    }

    //Method nay danh cho shop accepted refund
    @PostMapping("/shop/refunds/stripe/{refundId}")
    public ResponseEntity<ResultResponse<String>> refundStripeOnShop(
            @PathVariable("refundId") String refundId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) throws Exception {

        String result = orderService.refundStripe(refundId);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Refund orders successfully")
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .build());
    }
    @PostMapping("/shop/confirm/{orderId}")
    public ResponseEntity<ResultResponse<String>> confirmOrder(
            @PathVariable("orderId") String orderId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) throws Exception {

        orderService.confirmOrder(orderId);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Refund orders successfully")
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .build());
    }

    @PostMapping("/user/{orderId}")
    public ResponseEntity<ResultResponse<String>> cancelOrder(
            @PathVariable("orderId") String orderId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) throws Exception {

        orderService.cancelOrder(orderId);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Refund orders successfully")
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .build());
    }

    @DeleteMapping("/refunds/images")
    public ResponseEntity<ResultResponse> deleteRefundImagesOncloud() {
        List<RefundImages> refundImagesList = refundImagesRepository.findAll();
        for (RefundImages images: refundImagesList) {
            fileUploadUtils.deleteFile("refunds", images.getImageUrl());
        }

        return ResponseEntity.status(HttpStatus.OK).body(
                ResultResponse.builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Delete all refund images on cloud")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

//    @PostMapping
//    public ResponseEntity<ResultResponse<PaymentResponse>> updateRefundOrder(
//            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
//    ) throws Exception {
//
//        PaymentResponse result = orderService.placeOrders(ordersRequest, jwtToken);
//        return ResponseEntity.created(URI.create("")).body(
//                ResultResponse.<PaymentResponse>builder()
//                        .body(result)
//                        .timeStamp(LocalDateTime.now().toString())
//                        .message("Place orders successfully")
//                        .statusCode(HttpStatus.CREATED.value())
//                        .status(HttpStatus.CREATED)
//                        .build());
//    }


    @GetMapping("/vnpayParams")
    public VnpResponse handleVnpReturnParams(
            @RequestParam String vnp_Amount,
            @RequestParam String vnp_BankCode,
            @RequestParam String vnp_CardType,
            @RequestParam String vnp_OrderInfo,
            @RequestParam String vnp_PayDate,
            @RequestParam String vnp_ResponseCode,
            @RequestParam String vnp_TmnCode,
            @RequestParam String vnp_TransactionNo,
            @RequestParam String vnp_TransactionStatus,
            @RequestParam String vnp_TxnRef,
            @RequestParam String vnp_SecureHash,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {


        VnpResponse response = new VnpResponse();
        response.setVnp_Amount(vnp_Amount);
        response.setVnp_BankCode(vnp_BankCode);
        response.setVnp_CardType(vnp_CardType);
        response.setVnp_OrderInfo(vnp_OrderInfo);
        response.setVnp_PayDate(vnp_PayDate);
        response.setVnp_ResponseCode(vnp_ResponseCode);
        response.setVnp_TmnCode(vnp_TmnCode);
        response.setVnp_TransactionNo(vnp_TransactionNo);
        response.setVnp_TransactionStatus(vnp_TransactionStatus);
        response.setVnp_TxnRef(vnp_TxnRef);
        response.setVnp_SecureHash(vnp_SecureHash);
        // Không thành cong thì rollBack
        if (!vnp_TransactionStatus.equals("00") || !vnp_ResponseCode.equals("00")) {
            // rollback
            orderService.rollBackVnPayOrder(vnp_TxnRef);
        }else{
            List<Order> listOrder = orderRepository.findOrdersByVnpTxnRef(vnp_TxnRef);
            List<String> cartItemIds = new ArrayList<>();

            for (Order order : listOrder) {
                if(!order.getIsPaid()){
                    order.setIsPaid(true);
                }else{
                    return response;
                }
                for (OrderItem orderItem : order.getOrderItems()) {
                    cartItemIds.add(orderItem.getCartItemId());
                }
            }

            cartItemService.deleteCartItems(cartItemIds, jwtToken);
        }
        return response;
    }

    @GetMapping("/stripeParams")
    public StripeResponse handleStripeReturnParams(
            @RequestParam String paymentIntentId,
            @RequestParam String stripeResponseCode,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {

        StripeResponse response = new StripeResponse();
        response.setStripeResponseCode(stripeResponseCode);
        response.setPaymentIntentId(paymentIntentId);
        // Không thành cong thì  rollBack
        if (!stripeResponseCode.equals("00")) {
            // rollback
            orderService.rollBackStripeOrder(paymentIntentId);
        }else{
            // do some stuff like add money top shop, create ship......,
            List<Order> listOrder = orderRepository.findpaymentIntentId(paymentIntentId);
            List<String> cartItemIds = new ArrayList<>();

            for (Order order : listOrder) {
                if(!order.getIsPaid()){
                    order.setIsPaid(true);
                }else{
                    return response;
                }
                for (OrderItem orderItem : order.getOrderItems()) {
                    cartItemIds.add(orderItem.getCartItemId());
                }
            }

            cartItemService.deleteCartItems(cartItemIds, jwtToken);
        }
        return response;
    }

//    @GetMapping("/codParams")
//    public CodResponse handleCodReturnParams(
//            @RequestParam String paymentMethod,
//            @RequestParam String codResponseCode,
//            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
//
//        CodResponse response = new CodResponse();
//        response.setPaymentMethod(paymentMethod);
//        response.setCodResponseCode(codResponseCode);
//        // Không thành cong thì  rollBack
//        if (codResponseCode.equals("00")) {
//            List<Order> listOrder = orderRepository.paymentIntentId(paymentIntentId);
//
//            List<String> cartItemIds = new ArrayList<>();
//            for (Order order : listOrder) {
//                for (OrderItem orderItem : order.getOrderItems()) {
//                    cartItemIds.add(orderItem.getCartItemId());
//                }
//            }
//
//            cartItemService.deleteCartItems(cartItemIds, jwtToken);
//        }
//        return response;
//    }
}
