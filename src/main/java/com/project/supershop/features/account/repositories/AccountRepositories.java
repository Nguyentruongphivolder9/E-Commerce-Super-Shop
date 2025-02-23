package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.auth.domain.entities.AccessToken;
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
public interface AccountRepositories extends JpaRepository<Account, UUID> {
    Optional<Account> findAccountByEmail(String email);

    Optional<Account> findAccountByPhoneNumber(String phoneNumber);

    @Query("SELECT ad.device FROM AccountDevice ad WHERE ad.account.id = :accountId")
    Set<Device> findDevicesByAccountId(UUID accountId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AccountDevice ad WHERE ad.account.id = :accountId AND ad.device.id = :deviceId")
    void deleteAccountDeviceLink(UUID accountId, UUID deviceId);

    @Query("SELECT at FROM Account acc JOIN acc.accessTokens at WHERE acc.id = :accountId ORDER BY at.createdAt ASC")
    Set<AccessToken> findAccessTokensByAccountId(UUID accountId);

    Account findAccountById(UUID id);

}
