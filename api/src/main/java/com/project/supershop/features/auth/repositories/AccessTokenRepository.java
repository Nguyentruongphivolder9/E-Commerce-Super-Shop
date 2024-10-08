package com.project.supershop.features.auth.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;


public interface AccessTokenRepository extends JpaRepository<AccessToken, UUID> {
    Optional<AccessToken> findAccessTokenByToken(String token);
    Optional<AccessToken> findAccessTokenByRefreshToken(String refreshToken);
    Optional<AccessToken> findAccessTokenBySecretKey(byte[] secretKey);
    void deleteAccessTokenByToken(String token);

    @Query("SELECT d FROM Device d WHERE d.accessToken.id = :accessTokenId")
    Set<Device> findDevicesByAccessTokenId(UUID accessTokenId);

    @Query("SELECT acc FROM AccessToken acc JOIN acc.devices d WHERE d.id = :deviceId AND acc.account.id = :accountId")
    AccessToken findAccessTokenByDeviceIdAndAccountId(UUID deviceId, UUID accountId);

    @Query("SELECT acc FROM AccessToken acc JOIN FETCH acc.devices d WHERE acc.account.id = :accountId")
    AccessToken findAccessTokenByAccountId(@Param("accountId") UUID accountId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AccessToken at WHERE at.id = :accessTokenId")
    void deleteAccessTokenById(@Param("accessTokenId") UUID accessTokenId);

    @Query("SELECT d FROM Device d JOIN d.accessToken at WHERE at.token = :token")
    Set<Device> findDevicesByAccessTokenString(@Param("token") String token);
}
