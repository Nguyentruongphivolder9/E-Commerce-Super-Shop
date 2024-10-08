package com.project.supershop.features.rating.services.impl;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Seller;
import com.project.supershop.features.account.repositories.SellerRepository;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.orders.domain.entities.Order;
import com.project.supershop.features.orders.domain.entities.OrderItem;
import com.project.supershop.features.orders.repositories.OrderItemRepository;
import com.project.supershop.features.orders.repositories.OrderRepository;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductFigure;
import com.project.supershop.features.product.repositories.ProductFigureRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.rating.domain.dto.requests.RatingRequest;
import com.project.supershop.features.rating.domain.dto.responses.PaginationRatingForUserResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingForUserResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingFigureResponse;
import com.project.supershop.features.rating.domain.entities.FeedbackImage;
import com.project.supershop.features.rating.domain.entities.Rating;
import com.project.supershop.features.rating.domain.entities.VoteUseFull;
import com.project.supershop.features.rating.repositories.FeedbackImageRepository;
import com.project.supershop.features.rating.repositories.RatingRepository;
import com.project.supershop.features.rating.repositories.VoteUseFullRepository;
import com.project.supershop.features.rating.services.RatingService;
import com.project.supershop.features.rating.utils.Calculation;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final ProductRepository productRepository;
    private final JwtTokenService jwtTokenService;
    private final OrderItemRepository orderItemRepository;
    private final SellerRepository sellerRepository;
    private final FileUploadUtils fileUploadUtils;
    private final FeedbackImageRepository feedbackImageRepository;
    private final ProductFigureRepository productFigureRepository;
    private final OrderRepository orderRepository;
    private final VoteUseFullRepository voteUseFullRepository;
    private final ModelMapper modelMapper;

    public RatingServiceImpl(RatingRepository ratingRepository, ProductRepository productRepository, JwtTokenService jwtTokenService, OrderItemRepository orderItemRepository, SellerRepository sellerRepository, FileUploadUtils fileUploadUtils, FeedbackImageRepository feedbackImageRepository, ProductFigureRepository productFigureRepository, OrderRepository orderRepository, VoteUseFullRepository voteUseFullRepository, ModelMapper modelMapper) {
        this.ratingRepository = ratingRepository;
        this.productRepository = productRepository;
        this.jwtTokenService = jwtTokenService;
        this.orderItemRepository = orderItemRepository;
        this.sellerRepository = sellerRepository;
        this.fileUploadUtils = fileUploadUtils;
        this.feedbackImageRepository = feedbackImageRepository;
        this.productFigureRepository = productFigureRepository;
        this.orderRepository = orderRepository;
        this.voteUseFullRepository = voteUseFullRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void createRatings(RatingRequest formRequest, String jwtToken) throws IOException {
        Account account = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findById(UUID.fromString(formRequest.getProductId()));
        if(productOptional.isEmpty()) {
            throw new NotFoundException("Product by id: " + formRequest.getProductId() + " dose not exists.");
        }

        Optional<OrderItem> orderItemOptional = orderItemRepository.findById(UUID.fromString(formRequest.getOrderItemId()));
        if(orderItemOptional.isEmpty()) {
            throw new NotFoundException("OrderItem by id: " + formRequest.getOrderItemId() + " dose not exists.");
        }

        UUID shopId = productOptional.get().getShop().getId();
        Optional<Seller> optionalSeller = sellerRepository.findByShopId(shopId);
        if(optionalSeller.isEmpty()) {
            throw new NotFoundException("Seller by shopId: " + shopId + " dose not exists.");
        }

        Optional<ProductFigure> productFigureOptional = productFigureRepository.findByProductId(productOptional.get().getId());
        if(productFigureOptional.isEmpty()) {
            throw new NotFoundException(formRequest.getProductId() + " dose not exists.");
        }

        Optional<Order> orderOptional = orderRepository.findById(orderItemOptional.get().getOrder().getId());
        if(orderOptional.isEmpty()) {
            throw new NotFoundException("Order by shopId: " + shopId + " dose not exists.");
        }

        Order order = orderOptional.get();
        order.setIsRating(true);
        orderRepository.save(order);

        ProductFigure productFigure = productFigureOptional.get();
        int totalRatings = productFigure.getTotalRatings() + 1;
        int totalStarts = productFigure.getTotalStars() + formRequest.getRatingStar();
        productFigure.setTotalRatings(totalRatings);
        productFigure.setTotalStars(totalStarts);
        productFigure.setRatingStar(Calculation.StarRatingCalculating(totalRatings, totalStarts));
        productFigureRepository.save(productFigure);

        Seller seller = optionalSeller.get();
        seller.setTotalRating(optionalSeller.get().getTotalRating() + 1);
        seller.setTotalStars(optionalSeller.get().getTotalStars() + formRequest.getRatingStar());
        sellerRepository.save(seller);

        Rating newRating = Rating.createRating(formRequest, account, productOptional.get(), orderItemOptional.get());
        Rating ratingRes = ratingRepository.save(newRating);

        if(formRequest.getImageFiles() != null && formRequest.getImageFiles().length > 0) {
            List<FeedbackImage> feedbackImages = new ArrayList<>();
            for (MultipartFile imageFile : formRequest.getImageFiles()) {
                String fileName = fileUploadUtils.uploadFile(imageFile, "feedbacks");

                FeedbackImage feedbackImage = FeedbackImage.createFeedbackImage(fileName, ratingRes);
                feedbackImages.add(feedbackImage);
            }
            feedbackImageRepository.saveAll(feedbackImages);
        }

    }

    @Override
    public RatingFigureResponse getRatingFigureForUser(String productId, String jwtToken) {
        RatingFigureResponse response = new RatingFigureResponse();
        response.setStart5(ratingRepository.countRatingStar5());
        response.setStart4(ratingRepository.countRatingStar4());
        response.setStart3(ratingRepository.countRatingStar3());
        response.setStart2(ratingRepository.countRatingStar2());
        response.setStart1(ratingRepository.countRatingStar1());
        response.setWithPhoto(ratingRepository.countWithPhoto());
        response.setWithComment(ratingRepository.countWithComment());

        return response;
    }

    @Override
    public PaginationRatingForUserResponse getListRatingsForUser(QueryParameters queryParameters, String productId, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;

        int ratingStart = 0;
        if (queryParameters.getRating_filter() != null && !queryParameters.getRating_filter().isEmpty()) {
            try {
                ratingStart = Integer.parseInt(queryParameters.getRating_filter());
            } catch (NumberFormatException e) {
                throw new UnprocessableException("Field ratingStart must have a data type of integer");
            }
        }

        String sortBy = queryParameters.getSort_by();
        Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        boolean isWithPhoto = false;
        boolean isWithComment = false;

        if ("withPhoto".equalsIgnoreCase(sortBy)) {
            isWithPhoto = true;
        } else if ("withComment".equalsIgnoreCase(sortBy)) {
            isWithComment = false;
        }

        Pageable sortedPageable = PageRequest.of(page, limit, sort);

        Page<Rating> ratings = ratingRepository.findListRatingForUser(
                sortedPageable,
                UUID.fromString(productId),
                ratingStart,
                isWithPhoto,
                isWithComment);

        modelMapper.typeMap(Rating.class, RatingForUserResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getProduct().getId(), RatingForUserResponse::setProductId);
        });
        List<RatingForUserResponse> listRatings = ratings.getContent().stream()
                .map(rating -> {
                    RatingForUserResponse ratingForUserResponse = modelMapper.map(rating, RatingForUserResponse.class);
                    Optional<VoteUseFull> voteUseFullOptional = voteUseFullRepository.findByAccountIdAndByRatingId(parseJwtToAccount.getId(), rating.getId());
                    ratingForUserResponse.setCountVote(voteUseFullRepository.countVoteByRatingId(rating.getId()));
                    Optional<OrderItem> orderItemOptional = orderItemRepository.findById(rating.getOrderItem().getId());
                    orderItemOptional.ifPresent(orderItem -> ratingForUserResponse.setVariantName(orderItem.getVariantName()));
                    ratingForUserResponse.setIsVoteUseFull(voteUseFullOptional.isPresent());

                    return ratingForUserResponse;
                }).toList();

        PaginationRatingForUserResponse response = new PaginationRatingForUserResponse();
        response.setListRatings(listRatings);
        response.setTotalPages(ratings.getTotalPages());
        return response;
    }
}
