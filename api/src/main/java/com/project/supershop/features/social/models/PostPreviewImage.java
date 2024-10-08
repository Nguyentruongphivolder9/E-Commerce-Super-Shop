package com.project.supershop.features.social.models;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "postPreviewImage")
public class PostPreviewImage extends BaseEntity {
    private String imageUrl;

    public static PostPreviewImage createPostPreviewImage(String preImageUrl){
        return PostPreviewImage.builder()
                .imageUrl(preImageUrl)
                .build();
    }
}
