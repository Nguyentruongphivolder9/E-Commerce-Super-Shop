package com.project.supershop.features.email.repositories;

import com.project.supershop.features.email.domain.entities.Confirmation;
import com.project.supershop.features.email.domain.entities.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConfirmationRepository extends JpaRepository<Confirmation, UUID> {
    Confirmation findConfirmationByToken(String token);
    Confirmation findConfirmationByEmail(Email email);
    List<Confirmation> findByEmail(Email email);
    Confirmation findConfirmationByEmailAndToken (Email email, String token);
}
