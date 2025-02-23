package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

    Optional<Device> findDeviceByDeviceFingerPrint(String deviceFingerPrint);

    Optional<Device> findDeviceByIpAddress(String ipAddress);

    @Query("SELECT ad.account FROM AccountDevice ad WHERE ad.device.id = :deviceId")
    Set<Account> findAccountsByDeviceId(UUID deviceId);

    @Query("SELECT ad.account FROM AccountDevice ad WHERE ad.device.deviceFingerPrint = :deviceFingerPrint")
    List<Account> findAccountByDeviceFingerPrint(String deviceFingerPrint);

    @Modifying
    @Transactional
    @Query("UPDATE Device d SET d.accessToken = null WHERE d.accessToken.id = :accessTokenId")
    void unlinkDevicesByAccessTokenId(@Param("accessTokenId") UUID accessTokenId);

}
