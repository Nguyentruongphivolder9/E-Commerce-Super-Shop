package com.project.supershop.features.chat.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AccountResponse {
    private String id;
    private String avatarUrl;
    private Boolean isActive;
    private String email;
    private String userName;
    private String roleName;
    private String createdAt;
    private String updatedAt;
}
