package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.domain.entities.QrLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QrLoginRepo extends JpaRepository<QrLogin, UUID> {
    Optional<QrLogin> findQrLoginByToken(String token);
}
