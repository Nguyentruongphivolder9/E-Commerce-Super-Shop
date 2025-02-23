package com.project.supershop.features.account.services;

import com.project.supershop.features.account.domain.entities.Address;

import java.util.List;

public interface AddressService {
    List<Address> getAllAddresses();
    Address saveAddress();

}
