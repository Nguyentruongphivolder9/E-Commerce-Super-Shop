package com.project.supershop.features.account.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    Address findAddressById(UUID id);
}
