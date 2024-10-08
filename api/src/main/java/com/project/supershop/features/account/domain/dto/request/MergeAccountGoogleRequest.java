package com.project.supershop.features.account.domain.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MergeAccountGoogleRequest {
    private String avatar;
    private String user_name;
    private String email;
}
