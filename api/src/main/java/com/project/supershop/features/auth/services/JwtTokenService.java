package com.project.supershop.features.auth.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;

@Component
public interface JwtTokenService {
    JwtResponse createJwtResponse(Account account);

    Claims resolveClaims(String token, SecretKey secretKey);

    String resolveToken(HttpServletRequest request);

    boolean validateClaims(Claims claims, SecretKey secretKey) throws AuthenticationException;

    String decodePassword(String encodedPassword);

    Account parseJwtTokenToAccount(String token);

    Device resolveDevice(HttpServletRequest request, String accessToken) throws JsonProcessingException;

    JwtResponse createNewAccessTokenForUpdateAccountLogic(Account accountUpdate, Device deviceInfo, String token);


}