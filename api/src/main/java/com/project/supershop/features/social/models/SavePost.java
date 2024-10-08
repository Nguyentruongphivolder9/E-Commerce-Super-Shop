package com.project.supershop.features.social.models;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table( name = "saved_posts" )
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Data
@SuperBuilder
public class SavePost extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountId")
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private Post post;

    public static SavePost createSavePost(Account account, Post post){
        return SavePost.builder()
                .account(account)
                .post(post)
                .build();
    }
}
