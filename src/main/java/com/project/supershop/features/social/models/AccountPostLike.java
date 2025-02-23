package com.project.supershop.features.social.models;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "account_post_likes")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class AccountPostLike extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    public static AccountPostLike createAccountPostLike(Post post, Account account) {
        return AccountPostLike.builder()
                .post(post)
                .account(account)
                .build();
    }
}
