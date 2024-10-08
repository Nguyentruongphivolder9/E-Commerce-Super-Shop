package com.project.supershop.features.social.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AccountPostLikeResponse {
    private String id;
    private String postId;

    private String accountId;
    private String accountName;
    private String accountAvatarUrl;

    private String createdAt;
    private String updatedAt;
}
