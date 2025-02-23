package com.project.supershop.features.auth.domain.dto.response;

import com.project.supershop.features.account.domain.entities.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Key;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private long expireRefreshToken;
    private long expires;
    private String secretKey;
    private Account account;
}
