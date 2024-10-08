package com.project.supershop.features.orders.services.impl;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.cart.domain.entities.CartItem;
import com.project.supershop.features.cart.repositories.CartItemRepository;
import com.project.supershop.features.cart.services.CartItemService;
import com.project.supershop.features.orders.domain.dto.requests.OrderItemRequest;
import com.project.supershop.features.orders.domain.dto.requests.OrderRequest;
import com.project.supershop.features.orders.domain.dto.responses.OrderItemResponse;
import com.project.supershop.features.orders.domain.dto.responses.OrderResponse;
import com.project.supershop.features.orders.domain.dto.responses.PaymentResponse;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.domain.entities.OrderItem;
import com.project.supershop.features.orders.domain.dto.responses.*;
import com.project.supershop.features.orders.domain.entities.*;
import com.project.supershop.features.orders.enums.OrderStatus;
import com.project.supershop.features.orders.enums.PaymentMethod;
import com.project.supershop.features.orders.enums.RefundStataus;
import com.project.supershop.features.orders.repositories.OrderItemRepository;
import com.project.supershop.features.orders.repositories.OrderRepository;
import com.project.supershop.features.orders.repositories.RefundRepository;
import com.project.supershop.features.orders.services.OrderService;
import com.project.supershop.features.orders.services.PaymentService;
import com.project.supershop.features.product.domain.dto.responses.ProductDetailForShopResponse;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductVariant;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.repositories.ProductVariantRepository;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.features.voucher.domain.dto.responses.VoucherResponse;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import com.project.supershop.features.voucher.repositories.VoucherRepository;
import com.project.supershop.features.voucher.repositories.VoucherUsedRepository;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import com.project.supershop.utils.CheckTypeUUID;
import com.stripe.exception.StripeException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import javax.swing.text.html.Option;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final ModelMapper modelMapper;
    private final FileUploadUtils fileUploadUtils;
    private final JwtTokenService jwtTokenService;
    private final AccountRepositories accountRepositories;
    private final CartItemRepository cartItemRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherUsedRepository voucherUsedRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final RefundRepository refundRepository;
    public OrderServiceImpl(ModelMapper modelMapper, FileUploadUtils fileUploadUtils, JwtTokenService jwtTokenService, AccountRepositories accountRepositories, CartItemRepository cartItemRepository, VoucherRepository voucherRepository, VoucherUsedRepository voucherUsedRepository, ProductRepository productRepository, ProductVariantRepository productVariantRepository, CartItemService cartItemService, OrderItemRepository orderItemRepository, OrderRepository orderRepository, PaymentService paymentService, RefundRepository refundRepository) {
        this.modelMapper = modelMapper;
        this.fileUploadUtils = fileUploadUtils;
        this.jwtTokenService = jwtTokenService;
        this.accountRepositories = accountRepositories;
        this.cartItemRepository = cartItemRepository;
        this.voucherRepository = voucherRepository;
        this.voucherUsedRepository = voucherUsedRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.paymentService = paymentService;
        this.refundRepository = refundRepository;
    }

    @Override
    public PaymentResponse placeOrders(List<OrderRequest> ordersRequest, String jwtToken) throws UnsupportedEncodingException, StripeException {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<Order> orders = new ArrayList<>();
        for (OrderRequest orderRequest : ordersRequest) {
            // Tạo một Order mới
            Order order = new Order();
            order.setRecipientName(orderRequest.getRecipientName());
            order.setRecipientPhone(orderRequest.getRecipientPhone());
            order.setRecipientAddress(orderRequest.getRecipientAddress());
            order.setOrderTotal(orderRequest.getOrderTotal());
            order.setOrderStatus(orderRequest.getOrderStatus());
            order.setPaymentMethod(orderRequest.getPaymentMethod());
            order.setIsPaid(false);
            order.setComment(orderRequest.getComment());
            order.setShopId(orderRequest.getShopId());
            order.setVoucherId(orderRequest.getVoucherId());
            order.setAccount(parseJwtToAccount);
            order.setIsRating(false);
            order.setExpiredDateRating(LocalDateTime.now().plusDays(30));

            // Lưu OrderTimeline
            List<OrderTimeLine> orderTimeLines = new ArrayList<>();
            OrderTimeLine orderTimeLine = new OrderTimeLine();
            orderTimeLine.setDescription("Order placed. The order is waiting for confirmation from the seller.");
            orderTimeLine.setTimestamp(LocalDateTime.now());
            orderTimeLine.setOrder(order);
            orderTimeLines.add(orderTimeLine);
            order.setOrderTimelines(orderTimeLines);

            // Xử lý Voucher nếu có
            if (orderRequest.getVoucherId() != null && !orderRequest.getVoucherId().isEmpty()) {
                Optional<Voucher> voucherAppliedOp = voucherRepository.findById(UUID.fromString(orderRequest.getVoucherId()));
                if(voucherAppliedOp.isPresent() && voucherAppliedOp.get().getQuantity() > 0) {
                    Voucher voucherApplied = voucherAppliedOp.get();
                    long numberOfUsesVoucher = voucherUsedRepository.countByVoucherIdAndAccountId(voucherApplied.getId(), parseJwtToAccount.getId());
                    if(numberOfUsesVoucher >= voucherApplied.getMaxDistribution()){
                        throw new UnprocessableException("You have used this voucher more than the permitted number of times.");
                    }
                    order.setVoucherUsed(VoucherUsed.createVoucherUsed(parseJwtToAccount, voucherApplied, order)); // voucher Used
                    int subtract = voucherApplied.getQuantity() - 1;
                    voucherApplied.setQuantity(subtract);
                    voucherRepository.save(voucherApplied);
                }
                else if(voucherAppliedOp.isPresent() && voucherAppliedOp.get().getQuantity() == 0){
                    throw new UnprocessableException("The voucher is currently out of stock.");
                }else{
                   throw new NotFoundException("This voucher is no longer exists. It may have been removed.");
                }
            }

            List<OrderItem> orderItems = new ArrayList<>();
            // Tạo OrderItem cho Order
            for (OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
                Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(orderItemRequest.getProductId()), UUID.fromString(orderRequest.getShopId()));
                Product product = productOptional.orElseGet(() -> null);

                if(product != null && orderItemRequest.getProductVariantId().isEmpty() &&  product.getStockQuantity() > 0 ){
                    int subtractedStock = product.getStockQuantity() - orderItemRequest.getQuantity();
                    if(subtractedStock >= 0) {
                        product.setStockQuantity(subtractedStock);
                        product.getProductFigure().setSold(product.getProductFigure().getSold() + orderItemRequest.getQuantity());
                        productRepository.save(product);
                    }else{
                        throw new RuntimeException("The quantity you need to buy is greater than the quantity in stock");
                    }
                }else{
                    ProductVariant productVariant = productVariantRepository
                            .findProductVariantByIdAndProductId(UUID.fromString(orderItemRequest.getProductVariantId()), UUID.fromString(orderItemRequest.getProductId()))
                            .orElseGet(() -> null);
                    if (productVariant != null) {
                        int subtractedStock = productVariant.getStockQuantity() - orderItemRequest.getQuantity();
                        productVariant.setSold(productVariant.getSold() + orderItemRequest.getQuantity());
                        System.out.println(subtractedStock);
                        if(subtractedStock >= 0) {
                            productVariant.setStockQuantity(productVariant.getStockQuantity() - orderItemRequest.getQuantity());
                            productVariantRepository.save(productVariant);
                        }else{
                            throw new RuntimeException("The quantity you need to buy is greater than the quantity in stock");
                        }
                    }
                }

                OrderItem orderItem = OrderItem.createOrderItem(orderItemRequest ,order);
//                OrderItem orderItemSaving = orderItemRepository.save(orderItem);
                orderItems.add(orderItem);
            }

            order.setOrderItems(orderItems); // Lưu mảng OrderItems
            // Lưu Order vào cơ sở dữ liệu
            Order savedOrder = orderRepository.save(order);
            orders.add(savedOrder);
        }

        // Tạo paymentURL
        Long totalAmountOrders = orders.stream().reduce(0L, (result, order) -> result + Math.round(order.getOrderTotal()), Long::sum);
        PaymentResponse paymentResponse;
        if(orders.get(0).getPaymentMethod().equals(PaymentMethod.STRIPE.value())){
            paymentResponse = paymentService.createPaymentLink(totalAmountOrders, orders);
        }else if(orders.get(0).getPaymentMethod().equals(PaymentMethod.VNPAY.value())){
            paymentResponse = paymentService.createPaymentUrlVnPay(totalAmountOrders, orders);
        }else{
            paymentResponse = paymentService.createPaymentUrlCod(orders, jwtToken);
        }

        List<OrderResponse> orderResponses = orders.stream().map(order -> modelMapper.map(order, OrderResponse.class)).toList();
        return paymentResponse;
    }

    @Override
    public void rollBackVnPayOrder(String vnpTxnRef) {
        List<Order> listOrder = orderRepository.findOrdersByVnpTxnRef(vnpTxnRef);
        for (Order order: listOrder) {
            if(order.getIsPaid()) {
                return;
            }
        }
        //Rollback voucher
        List<UUID> voucherIdsAsUUID = new ArrayList<>();
        for (Order order : listOrder) {
            String voucherIdString = order.getVoucherId();
            if (voucherIdString != null && CheckTypeUUID.isValidUUID(voucherIdString)) {
                voucherIdsAsUUID.add(UUID.fromString(voucherIdString));
            }
        }

        //rollback Voucher
        List<Voucher> vouchersList = voucherRepository.findAllById(voucherIdsAsUUID);
        for (Voucher voucher : vouchersList) {
            voucher.setQuantity(voucher.getQuantity() + 1);
        }
        voucherRepository.saveAll(vouchersList);

        //rollBack Product
        for (Order order : listOrder) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(orderItem.getProductId()), UUID.fromString(order.getShopId()));
                Product product = productOptional.orElseGet(() -> null);

                if(product != null && orderItem.getProductVariantId().isEmpty()){
                    int addedReturnStock = product.getStockQuantity() + orderItem.getQuantity();
                        product.setStockQuantity(addedReturnStock);
                        productRepository.save(product);
                }else{
                    ProductVariant productVariant = productVariantRepository
                            .findProductVariantByIdAndProductId(UUID.fromString(orderItem.getProductVariantId()), UUID.fromString(orderItem.getProductId()))
                            .orElseGet(() -> null);
                    if (productVariant != null) {
                        int addedReturnStock = productVariant.getStockQuantity() + orderItem.getQuantity();
                            productVariant.setStockQuantity(productVariant.getStockQuantity() + orderItem.getQuantity());
                            productVariantRepository.save(productVariant);
                    }
                }
            }
        }

        orderRepository.deleteByVnpTxnRef(vnpTxnRef);
    }

    public void rollBackStripeOrder(String paymentIntentId) {
        List<Order> listOrder = orderRepository.findOrdersByVnpTxnRef(paymentIntentId);
        for (Order order: listOrder) {
            if(order.getIsPaid()) {
                return;
            }
        }

        //Rollback voucher
        List<UUID> voucherIdsAsUUID = new ArrayList<>();
        for (Order order : listOrder) {
            String voucherIdString = order.getVoucherId();
            if (voucherIdString != null && CheckTypeUUID.isValidUUID(voucherIdString)) {
                voucherIdsAsUUID.add(UUID.fromString(voucherIdString));
            }
        }

        List<Voucher> vouchersList = voucherRepository.findAllById(voucherIdsAsUUID);
        for (Voucher voucher : vouchersList) {
            voucher.setQuantity(voucher.getQuantity() + 1);
        }
        voucherRepository.saveAll(vouchersList);

        //rollBack Product
        for (Order order : listOrder) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(orderItem.getProductId()), UUID.fromString(order.getShopId()));
                Product product = productOptional.orElseGet(() -> null);

                if(product != null && orderItem.getProductVariantId().isEmpty()){
                    int addedReturnStock = product.getStockQuantity() + orderItem.getQuantity();
                    product.setStockQuantity(addedReturnStock);
                    productRepository.save(product);
                }else{
                    ProductVariant productVariant = productVariantRepository
                            .findProductVariantByIdAndProductId(UUID.fromString(orderItem.getProductVariantId()), UUID.fromString(orderItem.getProductId()))
                            .orElseGet(() -> null);
                    if (productVariant != null) {
                        int addedReturnStock = productVariant.getStockQuantity() + orderItem.getQuantity();
                        productVariant.setStockQuantity(productVariant.getStockQuantity() + orderItem.getQuantity());
                        productVariantRepository.save(productVariant);
                    }
                }
            }
        }

        orderRepository.deleteByPaymentIntentId(paymentIntentId);
    }

    @Override
    public List<OrderResponse> getOrdersByAccountId(QueryParameters queryParameters, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<Order> orders = orderRepository.findByAccountIdAndStatus(parseJwtToAccount.getId(), queryParameters.getStatus());

        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

            Account shop = accountRepositories.findAccountById(UUID.fromString(order.getShopId()));
            ShopInfomation shopInfomation = new ShopInfomation();
            shopInfomation.setId(shop.getId().toString());
            shopInfomation.setFullName(shop.getFullName());
            shopInfomation.setUserName(shop.getUserName());
            shopInfomation.setAvatarUrl(shop.getAvatarUrl());
            orderResponse.setShopInfomation(shopInfomation);

            List<OrderTimeLineResponse> orderTimeLineResponses = order.getOrderTimelines().stream()
                    .map(timeLine -> {
                        OrderTimeLineResponse timeLineResponse = modelMapper.map(timeLine, OrderTimeLineResponse.class);
                        timeLineResponse.setOrderStatus(order.getOrderStatus());
                        return timeLineResponse;
                    })
                    .collect(Collectors.toList());

            orderResponse.setOrderTimeLines(orderTimeLineResponses);// map OrderLineTime

            if (order.getVoucherUsed() != null && order.getVoucherUsed().getVoucher() != null) {
                orderResponse.setVoucherUsed(modelMapper.map(order.getVoucherUsed().getVoucher(), VoucherResponse.class));
            } else {
                orderResponse.setVoucherUsed(null);
            }

            if (order.getRefunds() != null) {
                Boolean isAnyProcessing = order.getRefunds().stream()
                        .max(Comparator.comparing(Refund::getUpdatedAt))
                        .map(latestRefund -> latestRefund.getStatus().equals(RefundStataus.PROCESSING.value()))
                        .orElse(false);
                orderResponse.setIsAnyRefundProcessing(isAnyProcessing);
            } else {
                orderResponse.setIsAnyRefundProcessing(false);
            }

            return orderResponse;
        }).toList();
        return orderResponses;
    }

    @Override
    public List<OrderResponse> getOrdersByShopId(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<Order> orders = orderRepository.findByShopId(parseJwtToAccount.getId().toString());

        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

            Account shop = accountRepositories.findAccountById(UUID.fromString(order.getShopId()));
            ShopInfomation shopInfomation = new ShopInfomation();
            shopInfomation.setId(shop.getId().toString());
            shopInfomation.setFullName(shop.getFullName());
            shopInfomation.setUserName(shop.getUserName());
            shopInfomation.setAvatarUrl(shop.getAvatarUrl());
            orderResponse.setShopInfomation(shopInfomation);

            List<OrderTimeLineResponse> orderTimeLineResponses = order.getOrderTimelines().stream()
                    .map(timeLine -> {
                        OrderTimeLineResponse timeLineResponse = modelMapper.map(timeLine, OrderTimeLineResponse.class);
                        timeLineResponse.setOrderStatus(order.getOrderStatus());
                        return timeLineResponse;
                    })
                    .collect(Collectors.toList());

            orderResponse.setOrderTimeLines(orderTimeLineResponses);// map OrderLineTime

            if (order.getVoucherUsed() != null && order.getVoucherUsed().getVoucher() != null) {
                orderResponse.setVoucherUsed(modelMapper.map(order.getVoucherUsed().getVoucher(), VoucherResponse.class));
            } else {
                orderResponse.setVoucherUsed(null);
            }

            if (order.getRefunds() != null) {
                Boolean isAnyProcessing = order.getRefunds().stream()
                        .max(Comparator.comparing(Refund::getUpdatedAt))
                        .map(latestRefund -> latestRefund.getStatus().equals(RefundStataus.PROCESSING.value()))
                        .orElse(false);
                orderResponse.setIsAnyRefundProcessing(isAnyProcessing);
            } else {
                orderResponse.setIsAnyRefundProcessing(false);
            }

            return orderResponse;
        }).toList();
        return orderResponses;
    }

    @Override
    public Page<OrderResponse> getOrderByShopIdWithPaginate(QueryParameters queryParameters, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken); // shop

        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;
        String searchValue = queryParameters.getSearch() != null ? queryParameters.getSearch() : null;
        String name = queryParameters.getName() != null ? queryParameters.getName() : null;
        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String status = null;
        if (queryParameters.getStatus() != null && !queryParameters.getStatus().isEmpty()) {
            if(OrderStatus.isValidOrderStatus(queryParameters.getStatus())){
                status = queryParameters.getStatus();
            }
        }

        Sort sort = Sort.by(direction, "updatedAt");
        Pageable sortedPageable = PageRequest.of(page, limit, sort);
        Page<Order> orders = orderRepository.findListOrderForShop(sortedPageable,
                                                                    parseJwtToAccount.getId().toString(),
                                                                    name,
                                                                    searchValue,
                                                                    status);

        Page<OrderResponse> orderResponses = orders.map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

            Account shop = accountRepositories.findAccountById(UUID.fromString(order.getShopId()));
            ShopInfomation shopInfomation = new ShopInfomation();
            shopInfomation.setId(shop.getId().toString());
            shopInfomation.setFullName(shop.getFullName());
            shopInfomation.setUserName(shop.getUserName());
            shopInfomation.setAvatarUrl(shop.getAvatarUrl());
            orderResponse.setShopInfomation(shopInfomation);

            List<OrderTimeLineResponse> orderTimeLineResponses = order.getOrderTimelines().stream()
                    .map(timeLine -> {
                        OrderTimeLineResponse timeLineResponse = modelMapper.map(timeLine, OrderTimeLineResponse.class);
                        timeLineResponse.setOrderStatus(order.getOrderStatus());
                        return timeLineResponse;
                    })
                    .collect(Collectors.toList());

            orderResponse.setOrderTimeLines(orderTimeLineResponses);// map OrderLineTime

            if (order.getVoucherUsed() != null && order.getVoucherUsed().getVoucher() != null) {
                orderResponse.setVoucherUsed(modelMapper.map(order.getVoucherUsed().getVoucher(), VoucherResponse.class));
            } else {
                orderResponse.setVoucherUsed(null);
            }

            if (order.getRefunds() != null) {
                Boolean isAnyProcessing = order.getRefunds().stream()
                        .max(Comparator.comparing(Refund::getUpdatedAt))
                        .map(latestRefund -> latestRefund.getStatus().equals(RefundStataus.PROCESSING.value()))
                        .orElse(false);
                orderResponse.setIsAnyRefundProcessing(isAnyProcessing);
            } else {
                orderResponse.setIsAnyRefundProcessing(false);
            }

            return orderResponse;
        });
        return orderResponses;
    }

    @Override
    public OrderResponse getOrderByOrderId(String orderId) {
        Optional<Order> orderOpt = orderRepository.findByOrderId(UUID.fromString(orderId));
        if(orderOpt.isEmpty()){
            throw new NotFoundException("Order does not exist");
        }else{
            Order order = orderOpt.get();
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            Account shop = accountRepositories.findAccountById(UUID.fromString(order.getShopId()));
            ShopInfomation shopInfomation = new ShopInfomation();
            shopInfomation.setId(shop.getId().toString());
            shopInfomation.setFullName(shop.getFullName());
            shopInfomation.setUserName(shop.getUserName());
            shopInfomation.setAvatarUrl(shop.getAvatarUrl());
            orderResponse.setShopInfomation(shopInfomation);

            List<OrderTimeLineResponse> orderTimeLineResponses = order.getOrderTimelines().stream()
                    .map(timeLine -> {
                        OrderTimeLineResponse timeLineResponse = modelMapper.map(timeLine, OrderTimeLineResponse.class);
                        timeLineResponse.setOrderStatus(order.getOrderStatus());
                        return timeLineResponse;
                    })
                    .collect(Collectors.toList());

            orderResponse.setOrderTimeLines(orderTimeLineResponses);// map OrderLineTime

            if (order.getVoucherUsed() != null && order.getVoucherUsed().getVoucher() != null) {
                orderResponse.setVoucherUsed(modelMapper.map(order.getVoucherUsed().getVoucher(), VoucherResponse.class));
            } else {
                orderResponse.setVoucherUsed(null);
            }

            return orderResponse;
        }
    }

    @Override
    public RefundResponse refundOrder(String orderId,  List<String> orderItemIds,
                                      String shopId ,String amount, String description, String reason,
                                      List<MultipartFile> imageFiles, String jwtToken) throws IOException {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Order> orderOpt = orderRepository.findByOrderId(UUID.fromString(orderId));
        Optional<Refund> refundOpt = refundRepository.findLatestRefundByOrderId(UUID.fromString(orderId));
        if(orderOpt.isEmpty()) throw new NotFoundException("Order is not found!");
        if(refundOpt.isPresent() && refundOpt.get().getStatus().equals(RefundStataus.PROCESSING.value())) throw new UnprocessableException("There's another refund processing.");

        System.out.println(shopId);
        Refund refund = Refund.builder()
                .order(orderOpt.get())
                .shopId(shopId)
                .amount(Double.parseDouble(amount))
                .reason(reason)
                .description(description)
                .status(RefundStataus.PROCESSING.value())
                .refundDate(LocalDateTime.now()).build();

        List<RefundItem> refundItems = new ArrayList<>();
        for (String orderItemId: orderItemIds) {
            Integer refundQty = Integer.parseInt(orderItemId.split("/")[1]);
            RefundItem refundItem = RefundItem.builder().refund(refund)
                                                        .orderItemId(orderItemId.split("/")[0])
                                                        .refundQuantity(refundQty).build();
            refundItems.add(refundItem);
        }

        List<RefundImages> refundImages = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String fileUrl = fileUploadUtils.uploadFile(imageFile, "refunds");
            RefundImages refundImage = RefundImages.builder()
                                                    .imageUrl(fileUrl)
                                                    .refund(refund).build();
            refundImages.add(refundImage);
        }
        refund.setRefundImages(refundImages);
        refund.setRefundItems(refundItems);
        Refund savedRefund = refundRepository.save(refund);

        RefundResponse refundResponse = modelMapper.map(savedRefund, RefundResponse.class);

        List<RefundItemResponse> listOrderItem =  refundResponse.getRefundItems().stream().map(refundItem -> {
           Optional<OrderItem> orderItemOpt = orderItemRepository.findById(UUID.fromString(refundItem.getOrderItemId()));
           if(orderItemOpt.isEmpty()){
              throw new NotFoundException("OrderItem is missing.");
           }
            OrderItemResponse orderItemResponse = modelMapper.map(orderItemOpt.get(), OrderItemResponse.class);
            refundItem.setOrderItem(orderItemResponse);
            refundItem.setRefundId(refundResponse.getId());
            return refundItem;
        }).toList();

        refundResponse.setRefundItems(listOrderItem);

        return refundResponse;
    }

    @Override
    public List<RefundResponse> getRefundOrderByShop(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken); // shop
        List<Refund> refunds = refundRepository.findRefundOrderByShopId(parseJwtToAccount.getId().toString());

        List<RefundResponse> refundsResponse = refunds.stream().map(refund -> {
            RefundResponse refundResponse = modelMapper.map(refund, RefundResponse.class);

            //List refunds
            List<RefundItemResponse> refundItemsResponse = refundResponse.getRefundItems().stream().map(rfiRes -> {

                OrderItem orderItem = orderItemRepository.findByOrderId(UUID.fromString(rfiRes.getOrderItemId()));
                OrderItemResponse orderItemRes = modelMapper.map(orderItem, OrderItemResponse.class);

                rfiRes.setOrderItem(orderItemRes);
                return rfiRes;
            }).toList();
            refundResponse.setRefundItems(refundItemsResponse);

            // User
            Account account = accountRepositories.findAccountById(refund.getOrder().getAccount().getId()); // user
            Map<String, String > userRes = new HashMap<>();
            userRes.put("id", account.getId().toString());
            userRes.put("fullName", account.getFullName());
            userRes.put("userName", account.getUserName());
            userRes.put("avatarUrl", account.getAvatarUrl());
            refundResponse.setUser(userRes);

            return refundResponse;
        }).toList();

        return refundsResponse;
    }

    @Override
    public Page<RefundResponse> getRefundOrderByShopWithPaginate(QueryParameters queryParameters, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken); // shop

        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;
        String searchValue = queryParameters.getSearch() != null ? queryParameters.getSearch() : null;
        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String status = null;
        if (queryParameters.getStatus() != null && !queryParameters.getStatus().isEmpty()) {
            if(RefundStataus.isValidRefundOrderStatus(queryParameters.getStatus())){
                status = queryParameters.getStatus();
            }
        }

        Sort sort = Sort.by(direction, "updatedAt");
        Pageable sortedPageable = PageRequest.of(page, limit, sort);

        System.out.println(status);
        Page<Refund> refundOrders = refundRepository.findListRefundOrderForShop(sortedPageable,
                                                                            parseJwtToAccount.getId().toString(),
                                                                            status);

        Page<RefundResponse> refundsResponse = refundOrders.map(refund -> {
            RefundResponse refundResponse = modelMapper.map(refund, RefundResponse.class);

            //List refunds
            List<RefundItemResponse> refundItemsResponse = refundResponse.getRefundItems().stream().map(rfiRes -> {

                OrderItem orderItem = orderItemRepository.findByOrderId(UUID.fromString(rfiRes.getOrderItemId()));
                OrderItemResponse orderItemRes = modelMapper.map(orderItem, OrderItemResponse.class);

                rfiRes.setOrderItem(orderItemRes);
                return rfiRes;
            }).toList();
            refundResponse.setRefundItems(refundItemsResponse);

            // User
            Account account = accountRepositories.findAccountById(refund.getOrder().getAccount().getId()); // user
            Map<String, String > userRes = new HashMap<>();
            userRes.put("id", account.getId().toString());
            userRes.put("fullName", account.getFullName());
            userRes.put("userName", account.getUserName());
            userRes.put("avatarUrl", account.getAvatarUrl());
            refundResponse.setUser(userRes);

            return refundResponse;
        });

        return refundsResponse;
    }

    @Override
    public RefundResponse getRefundById(String refundId, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        System.out.println(refundId);
        Optional<Refund> refund = refundRepository.findById(UUID.fromString(refundId));
        if(refund.isPresent()) {
            RefundResponse refundResponse = modelMapper.map(refund.get(), RefundResponse.class);

            List<RefundItemResponse> refundItemsResponse = refundResponse.getRefundItems().stream().map(rfiRes -> {

                OrderItem orderItem = orderItemRepository.findByOrderId(UUID.fromString(rfiRes.getOrderItemId()));
                OrderItemResponse orderItemRes = modelMapper.map(orderItem, OrderItemResponse.class);

                rfiRes.setOrderItem(orderItemRes);
                return rfiRes;
            }).toList();
            refundResponse.setRefundItems(refundItemsResponse);

            // User
            Account account = accountRepositories.findAccountById(refund.get().getOrder().getAccount().getId()); // user
            Map<String, String > userRes = new HashMap<>();
            userRes.put("id", account.getId().toString());
            userRes.put("fullName", account.getFullName());
            userRes.put("userName", account.getUserName());
            userRes.put("avatarUrl", account.getAvatarUrl());
            refundResponse.setUser(userRes);
            return refundResponse;
        }else{
            throw new NotFoundException("Not found");
        }
    }

    @Override
    public String refundStripe(String refundId) throws StripeException {
        System.out.println(refundId);
        Optional<Refund> refund = refundRepository.findById(UUID.fromString(refundId));
        if (refund.isEmpty()){
            throw new NotFoundException("Order is relative to refund not found. Please check again.");
        }
        String refundPaymentIntentId = refund.get().getOrder().getRefundPaymentIntentId();
        Long amountRefund = Math.round(refund.get().getAmount());
        String status = paymentService.refundStripe(refundPaymentIntentId, amountRefund);

        if(status.equals("succeeded")){
            refund.get().setStatus(RefundStataus.DONE.value());
            refund.get().getOrder().setOrderStatus(OrderStatus.REFUNDED.value());
            refundRepository.save(refund.get());
        }
        return status;
    }

    @Override
    public void cancelOrder(String orderId) {
        Optional<Order> order = orderRepository.findByOrderId(UUID.fromString(orderId));
        if(order.isEmpty()) {
            throw new NotFoundException("Order is relative to refund not found. Please check again.");
        }

        order.get().setOrderStatus(OrderStatus.CANCELLED.value());
        orderRepository.save(order.get());

    }

    @Override
    public void confirmOrder(String orderId) {
        Optional<Order> order = orderRepository.findByOrderId(UUID.fromString(orderId));
        if(order.isEmpty()) {
            throw new NotFoundException("Order is relative to refund not found. Please check again.");
        }

        order.get().setOrderStatus(OrderStatus.CONFIRMED.value());
        orderRepository.save(order.get());
    }

    @Override
    public void placeOrdersMobile(List<OrderRequest> ordersRequest, String paymentIntentId ,String jwtToken) throws UnsupportedEncodingException, StripeException {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<Order> orders = new ArrayList<>();
        for (OrderRequest orderRequest : ordersRequest) {
            // Tạo một Order mới
            Order order = new Order();
            order.setRecipientName(orderRequest.getRecipientName());
            order.setRecipientPhone(orderRequest.getRecipientPhone());
            order.setRecipientAddress(orderRequest.getRecipientAddress());
            order.setOrderTotal(orderRequest.getOrderTotal());
            order.setOrderStatus(orderRequest.getOrderStatus());
            order.setPaymentMethod(orderRequest.getPaymentMethod());
            order.setIsPaid(true);
            order.setComment(orderRequest.getComment());
            order.setShopId(orderRequest.getShopId());
            order.setVoucherId(orderRequest.getVoucherId());
            order.setAccount(parseJwtToAccount);
            order.setIsRating(false);
            order.setExpiredDateRating(LocalDateTime.now().plusDays(30));
            order.setRefundPaymentIntentId(paymentIntentId);
            // Lưu OrderTimeline
            List<OrderTimeLine> orderTimeLines = new ArrayList<>();
            OrderTimeLine orderTimeLine = new OrderTimeLine();
            orderTimeLine.setDescription("Order placed. The order is waiting for confirmation from the seller.");
            orderTimeLine.setTimestamp(LocalDateTime.now());
            orderTimeLine.setOrder(order);
            orderTimeLines.add(orderTimeLine);
            order.setOrderTimelines(orderTimeLines);

            // Xử lý Voucher nếu có
            if (orderRequest.getVoucherId() != null && !orderRequest.getVoucherId().isEmpty()) {
                Optional<Voucher> voucherAppliedOp = voucherRepository.findById(UUID.fromString(orderRequest.getVoucherId()));
                if(voucherAppliedOp.isPresent() && voucherAppliedOp.get().getQuantity() > 0) {
                    Voucher voucherApplied = voucherAppliedOp.get();
                    long numberOfUsesVoucher = voucherUsedRepository.countByVoucherIdAndAccountId(voucherApplied.getId(), parseJwtToAccount.getId());
                    if(numberOfUsesVoucher >= voucherApplied.getMaxDistribution()){
                        throw new UnprocessableException("You have used this voucher more than the permitted number of times.");
                    }
                    order.setVoucherUsed(VoucherUsed.createVoucherUsed(parseJwtToAccount, voucherApplied, order)); // voucher Used
                    int subtract = voucherApplied.getQuantity() - 1;
                    voucherApplied.setQuantity(subtract);
                    voucherRepository.save(voucherApplied);
                }
                else if(voucherAppliedOp.isPresent() && voucherAppliedOp.get().getQuantity() == 0){
                    throw new UnprocessableException("The voucher is currently out of stock.");
                }else{
                    throw new NotFoundException("This voucher is no longer exists. It may have been removed.");
                }
            }

            List<OrderItem> orderItems = new ArrayList<>();
            // Tạo OrderItem cho Order
            for (OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
                Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(orderItemRequest.getProductId()), UUID.fromString(orderRequest.getShopId()));
                Product product = productOptional.orElseGet(() -> null);

                if(product != null && orderItemRequest.getProductVariantId().isEmpty() &&  product.getStockQuantity() > 0 ){
                    int subtractedStock = product.getStockQuantity() - orderItemRequest.getQuantity();
                    if(subtractedStock >= 0) {
                        product.setStockQuantity(subtractedStock);
                        product.getProductFigure().setSold(product.getProductFigure().getSold() + orderItemRequest.getQuantity());
                        productRepository.save(product);
                    }else{
                        throw new RuntimeException("The quantity you need to buy is greater than the quantity in stock");
                    }
                }else{
                    ProductVariant productVariant = productVariantRepository
                            .findProductVariantByIdAndProductId(UUID.fromString(orderItemRequest.getProductVariantId()), UUID.fromString(orderItemRequest.getProductId()))
                            .orElseGet(() -> null);
                    if (productVariant != null) {
                        int subtractedStock = productVariant.getStockQuantity() - orderItemRequest.getQuantity();
                        productVariant.setSold(productVariant.getSold() + orderItemRequest.getQuantity());
                        System.out.println(subtractedStock);
                        if(subtractedStock >= 0) {
                            productVariant.setStockQuantity(productVariant.getStockQuantity() - orderItemRequest.getQuantity());
                            productVariantRepository.save(productVariant);
                        }else{
                            throw new RuntimeException("The quantity you need to buy is greater than the quantity in stock");
                        }
                    }
                }

                OrderItem orderItem = OrderItem.createOrderItem(orderItemRequest ,order);
//                OrderItem orderItemSaving = orderItemRepository.save(orderItem);
                orderItems.add(orderItem);
            }

            order.setOrderItems(orderItems); // Lưu mảng OrderItems
            // Lưu Order vào cơ sở dữ liệu
            Order savedOrder = orderRepository.save(order);
            orders.add(savedOrder);
        }

        List<CartItem> listCartByAcc = cartItemRepository.findListCartItemByAccountId(parseJwtToAccount.getId());
        Set<UUID> cartItemIds =  listCartByAcc.stream().map(item -> item.getId()).collect(Collectors.toSet());

        cartItemRepository.deteleMultipleCartByIdAndAccountId(cartItemIds, parseJwtToAccount.getId());

        List<OrderResponse> orderResponses = orders.stream().map(order -> modelMapper.map(order, OrderResponse.class)).toList();
    }
}
