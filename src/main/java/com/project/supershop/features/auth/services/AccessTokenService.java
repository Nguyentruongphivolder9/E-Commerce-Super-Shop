package com.project.supershop.features.auth.services;

import com.project.supershop.features.account.domain.dto.response.DeviceResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.repositories.AccessTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public interface AccessTokenService {
    Optional<AccessToken> findByToken(String token);

    AccessToken findById(UUID accountId);

    AccessToken findByRefreshToken(String refreshToken);

    AccessToken getAccessTokenBySecretKey(byte[] secretKey);

    void deleteByToken(String token);

    AccessToken saveToken(AccessToken accessToken);

    AccessToken saveAccessTokenAndDeviceInfo(UUID accessTokenId, UUID deviceId);

    AccessToken addDeviceToAccessToken(UUID deviceId, UUID accessTokenId);

    AccessToken findAccessTokenByAccountIdAndDeviceId(UUID deviceId, UUID accountId);

    void deleteAccessTokenAndRelatedData(UUID accessTokenId);

    void deleteAccessToken(UUID accessTokenId);

    Set<DeviceResponse> getAllDeviceByAccessToken(String token, UUID accountId);
}
