package com.project.supershop.features.account.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoResponse {
    private String id;
    private String avatarUrl;
    private Boolean isActive;
    private String email;
    private String fullName;
    private String userName;
}
