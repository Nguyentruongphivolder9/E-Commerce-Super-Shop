package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.AccountDevice;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface AccountDeviceRepository extends JpaRepository<AccountDevice, UUID> {
    @Modifying
    @Transactional
    @Query("DELETE FROM AccountDevice ad WHERE ad.device.id IN (SELECT d.id FROM Device d WHERE d.accessToken.id = :accessTokenId)")
    void deleteAccountDevicesByAccessTokenId(@Param("accessTokenId") UUID accessTokenId);

    List<AccountDevice> findAllByAccountOrderByCreatedAtDesc(Account account);
}
