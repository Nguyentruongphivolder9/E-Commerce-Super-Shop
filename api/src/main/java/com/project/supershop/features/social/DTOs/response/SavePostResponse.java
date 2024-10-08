package com.project.supershop.features.social.DTOs.response;

import com.project.supershop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SavePostResponse {
    private String id;
    private String accountId;
    private String postId;
}
