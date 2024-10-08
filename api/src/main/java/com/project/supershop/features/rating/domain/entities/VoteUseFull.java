package com.project.supershop.features.rating.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "voteUseFull")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class VoteUseFull extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "ratingId")
    private Rating rating;

    public static VoteUseFull createVoteUseFull(Rating rating, Account account){
        return VoteUseFull.builder()
                .rating(rating)
                .account(account)
                .build();
    }
}
