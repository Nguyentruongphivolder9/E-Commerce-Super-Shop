package com.project.supershop.features.rating.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Seller;
import com.project.supershop.features.account.repositories.SellerRepository;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.rating.domain.dto.requests.SellerFeedbackRequest;
import com.project.supershop.features.rating.domain.entities.Rating;
import com.project.supershop.features.rating.domain.entities.SellerFeedback;
import com.project.supershop.features.rating.repositories.RatingRepository;
import com.project.supershop.features.rating.repositories.SellerFeedbackRepository;
import com.project.supershop.features.rating.services.SellerFeedbackService;
import com.project.supershop.handler.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SellerFeedbackServiceImpl implements SellerFeedbackService {
    private final RatingRepository ratingRepository;
    private final SellerFeedbackRepository sellerFeedbackRepository;
    private final JwtTokenService jwtTokenService;
    private final SellerRepository sellerRepository;

    public SellerFeedbackServiceImpl(RatingRepository ratingRepository, SellerFeedbackRepository sellerFeedbackRepository, JwtTokenService jwtTokenService, SellerRepository sellerRepository) {
        this.ratingRepository = ratingRepository;
        this.sellerFeedbackRepository = sellerFeedbackRepository;
        this.jwtTokenService = jwtTokenService;
        this.sellerRepository = sellerRepository;
    }

    @Override
    public void createSellerFeedback(SellerFeedbackRequest formRequest, String jwtToken) {
        Account account = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Rating> ratingOptional = ratingRepository.findById(UUID.fromString(formRequest.getRatingId()));
        if(ratingOptional.isEmpty()) {
            throw new NotFoundException(formRequest.getRatingId() + " dose not exists.");
        }

        UUID shopId = ratingOptional.get().getProduct().getShop().getId();
        Optional<Seller> optionalSeller = sellerRepository.findById(shopId);
        if(optionalSeller.isEmpty()) {
            throw new NotFoundException(shopId + " dose not exists.");
        }

        Seller seller = optionalSeller.get();
        seller.setRatingResponse(optionalSeller.get().getRatingResponse() + 1);
        sellerRepository.save(seller);

        SellerFeedback sellerFeedback = SellerFeedback.createSellerFeedback(formRequest, ratingOptional.get(), account);
        sellerFeedbackRepository.save(sellerFeedback);
    }
}
