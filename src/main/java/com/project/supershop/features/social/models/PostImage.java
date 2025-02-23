package com.project.supershop.features.social.models;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.product.domain.entities.Category;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "postImages")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class PostImage extends BaseEntity {
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "postId")
    private Post post;

    public static PostImage createPostImage(String fileName, Post post){
        return PostImage.builder()
                .imageUrl(fileName)
                .post(post)
                .build();
    }
}
