package com.project.supershop.features.social.DTOs.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostResponse {
    private String id;
    private String caption;
    private String tags;
    private String location;
    private String creatorId;
    private String creatorName;
    private String creatorAvatarUrl;
    private List<AccountPostLikeResponse> likes;
    private List<PostImageResponse> postImageResponses;
    private String createdAt;
    private String updatedAt;
}
