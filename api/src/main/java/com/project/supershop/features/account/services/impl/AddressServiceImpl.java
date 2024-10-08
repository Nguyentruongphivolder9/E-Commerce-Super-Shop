package com.project.supershop.features.account.services.impl;

import com.project.supershop.features.account.domain.entities.Address;
import com.project.supershop.features.account.repositories.AddressRepository;
import com.project.supershop.features.account.services.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;
    public AddressServiceImpl( AddressRepository addressRepository){
        this.addressRepository = addressRepository;
    }
    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public Address saveAddress() {
        return null;
    }
}
