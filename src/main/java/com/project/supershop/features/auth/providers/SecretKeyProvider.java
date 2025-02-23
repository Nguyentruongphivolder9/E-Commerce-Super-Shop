package com.project.supershop.features.auth.providers;

import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.repositories.AccessTokenRepository;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

@Component
public class SecretKeyProvider {
    private SecretKey secretKey;

    @Autowired
    private AccessTokenRepository accessTokenRepository;

    @PostConstruct
    public void init() {
        generateNewKey();
    }

    public SecretKey getNewSecretKey() {
        return this.secretKey;
    }

    public SecretKey getSecretKeyByAccessToken(String token) {
        Optional<AccessToken> accessTokenOpt = accessTokenRepository.findAccessTokenByToken(token);
        if (accessTokenOpt.isPresent()) {
            AccessToken accessToken = accessTokenOpt.get();
            return Keys.hmacShaKeyFor(accessToken.getSecretKey()); // Tái tạo SecretKey từ byte[]
        } else {
            throw new RuntimeException("AccessToken not found");
        }
    }

    public void generateNewKeyForAccessToken(AccessToken accessToken) {
        SecretKey newSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        accessToken.setSecretKey(newSecretKey.getEncoded()); // Lưu SecretKey dưới dạng byte[]
        accessTokenRepository.save(accessToken);
    }



    public void generateNewKey() {
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
