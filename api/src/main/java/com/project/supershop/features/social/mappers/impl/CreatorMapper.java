package com.project.supershop.features.social.mappers.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.social.DTOs.response.Creator;
import com.project.supershop.features.social.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class CreatorMapper implements Mapper<Account, Creator> {
    private final ModelMapper modelMapper;

    public CreatorMapper (ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configureCreatorMappings();
    }

    private void configureCreatorMappings() {
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        TypeMap<Account, Creator> typeMap = modelMapper
                .createTypeMap(Account.class, Creator.class);
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getId(), Creator::setId));
        typeMap.addMappings(mapper -> mapper
                .map(Account::getFullName, Creator::setFullname));
        typeMap.addMappings(mapper -> mapper
                .map(Account::getAvatarUrl, Creator::setAvatarUrl));
    }

    @Override
    public Creator mapTo (Account account) {
        return modelMapper.map(account, Creator.class);
    }

    @Override
    public Account mapFrom (Creator creator) {
        return modelMapper.map(creator, Account.class);
    }
}
