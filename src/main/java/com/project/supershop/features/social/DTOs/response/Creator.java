package com.project.supershop.features.social.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Creator {
    private String id;
    private String fullname;
    private String avatarUrl;
}
