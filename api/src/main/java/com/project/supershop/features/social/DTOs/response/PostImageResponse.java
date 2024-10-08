package com.project.supershop.features.social.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostImageResponse {
    private String id;
    private String imageUrl;
    private String postId;
}
