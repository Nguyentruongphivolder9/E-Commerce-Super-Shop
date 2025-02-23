package com.project.supershop.features.rating.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.rating.domain.entities.Rating;
import com.project.supershop.features.rating.domain.entities.VoteUseFull;
import com.project.supershop.features.rating.repositories.RatingRepository;
import com.project.supershop.features.rating.repositories.VoteUseFullRepository;
import com.project.supershop.features.rating.services.VoteUseFullService;
import com.project.supershop.handler.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VoteUseFullServiceImpl implements VoteUseFullService {
    private final JwtTokenService jwtTokenService;
    private final VoteUseFullRepository voteUseFullRepository;
    private final RatingRepository ratingRepository;

    public VoteUseFullServiceImpl(JwtTokenService jwtTokenService, VoteUseFullRepository voteUseFullRepository, RatingRepository ratingRepository) {
        this.jwtTokenService = jwtTokenService;
        this.voteUseFullRepository = voteUseFullRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public void toggleLikeRating(String ratingId, String jwtToken) {
        Account account = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Rating> ratingOptional = ratingRepository.findById(UUID.fromString(ratingId));
        if(ratingOptional.isEmpty()) {
            throw new NotFoundException(ratingId + " dose not exists.");
        }

        Optional<VoteUseFull> voteUseFullOptional = voteUseFullRepository.findByAccountIdAndByRatingId(account.getId(), ratingOptional.get().getId());
        if(voteUseFullOptional.isEmpty()) {
            VoteUseFull voteUseFull = VoteUseFull.createVoteUseFull(ratingOptional.get(), account);
            voteUseFullRepository.save(voteUseFull);
        } else {
            VoteUseFull voteUseFull = voteUseFullOptional.get();
            voteUseFullRepository.delete(voteUseFull);
        }
    }
}
