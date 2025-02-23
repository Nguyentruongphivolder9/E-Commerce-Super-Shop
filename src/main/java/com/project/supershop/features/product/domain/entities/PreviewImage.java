package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "previewImage")
public class PreviewImage extends BaseEntity {
    private String imageUrl;

    public static PreviewImage createProduct(String preImageUrl){
        return PreviewImage.builder()
                .imageUrl(preImageUrl)
                .build();
    }
}
