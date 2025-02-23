package com.project.supershop.features.social.models;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.product.domain.entities.CategoryImage;
import com.project.supershop.features.social.DTOs.request.PostRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "posts")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Post extends BaseEntity {

    @Column(length = 2200)
    private String caption;
    @Column(length = 2200)
    private String location;
    private String tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountId")
    private Account creator;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AccountPostLike> likes;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PostImage> postImages;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SavePost> savePosts;

    public static Post createPost(PostRequest postRequest) {
        return Post.builder()
                .caption(postRequest.getCaption())
                .location(postRequest.getLocation())
                .tags(postRequest.getTags())
//                .creator()
//                .likes(List.of(creator))
//                .postImages(postImages)
                .build();
    }
}
