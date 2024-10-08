package com.project.supershop.features.account.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WaitingForEmailVerifyRequest {
    private String email;
    private String token;
}
