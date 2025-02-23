package com.project.supershop.features.email.repositories;

import com.project.supershop.features.email.domain.entities.Confirmation;
import com.project.supershop.features.email.domain.entities.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmailRepository extends JpaRepository<Email, UUID> {
    Email findEmailByEmailAddress(String emailAddress);
    Email findEmailByConfirmations(Confirmation confirmation);
}
