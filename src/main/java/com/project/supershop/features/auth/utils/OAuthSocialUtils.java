package com.project.supershop.features.auth.utils;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import facebook4j.Facebook;
import facebook4j.FacebookException;
import org.joda.time.LocalDateTime;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;

import java.io.IOException;

@Configuration
public class OAuthSocialUtils {
    public Account createAccountFromPrincipal(OAuth2AuthenticatedPrincipal principal) {
        Account account = new Account();
        account.setEmail(principal.getAttribute("email"));
        account.setUserName(principal.getAttribute("name"));
        account.setAvatarUrl(principal.getAttribute("picture"));
        account.setIsEnable(principal.getAttribute("email_verified"));
        account.setRoleName("USER");
        return account;
    }

    public ResponseEntity<ResultResponse<JwtResponse>> handleErrorResponse(IOException e) {
        System.err.println("Error exchanging code for token: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResultResponse.<JwtResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(null)
                        .message("Error exchanging code for token")
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }

    public Account createAccountFromFacebook(OAuth2AuthenticatedPrincipal principal) throws FacebookException {
        Account account = new Account();
        account.setEmail(principal.getAttribute("email"));
        account.setUserName(principal.getAttribute("name"));
        account.setAvatarUrl(principal.getAttribute("picture"));
        account.setIsEnable(principal.getAttribute("email_verified"));
        account.setRoleName("USER");
        return account;
    }

    public ResponseEntity<ResultResponse<JwtResponse>> handleErrorResponse(Exception e) {
        System.err.println("Error exchanging code for token: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResultResponse.<JwtResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(null)
                        .message("Error exchanging code for token")
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }
}
