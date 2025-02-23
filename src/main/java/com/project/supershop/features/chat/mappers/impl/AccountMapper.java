package com.project.supershop.features.chat.mappers.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.response.AccountResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper implements Mapper<Account, AccountResponse> {

    private final ModelMapper modelMapper;

    public AccountMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configureMappings();
    }

    private void configureMappings () {
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        TypeMap<Account, AccountResponse> typeMap =
            modelMapper.createTypeMap(Account.class, AccountResponse.class);

        typeMap.addMappings(mapper -> mapper.map(Account::getId, AccountResponse::setId));
        typeMap.addMappings(mapper -> mapper.map(Account::getAvatarUrl, AccountResponse::setAvatarUrl));
        typeMap.addMappings(mapper -> mapper.map(Account::getIsActive, AccountResponse::setIsActive));
        typeMap.addMappings(mapper -> mapper.map(Account::getEmail, AccountResponse::setEmail));
        typeMap.addMappings(mapper -> mapper.map(Account::getUserName, AccountResponse::setUserName));
        typeMap.addMappings(mapper -> mapper.map(Account::getRoleName, AccountResponse::setRoleName));
        typeMap.addMappings(mapper -> mapper.map(Account::getCreatedAt, AccountResponse::setCreatedAt));
        typeMap.addMappings(mapper -> mapper.map(Account::getUpdatedAt, AccountResponse::setUpdatedAt));
    }

    @Override
    public AccountResponse mapTo (Account account) {
        return modelMapper.map(account, AccountResponse.class);
    }

    @Override
    public Account mapFrom (AccountResponse accountResponse) {
        return modelMapper.map(accountResponse, Account.class);
    }
}
