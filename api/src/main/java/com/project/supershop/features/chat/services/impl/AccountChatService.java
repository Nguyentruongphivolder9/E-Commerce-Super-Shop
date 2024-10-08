package com.project.supershop.features.chat.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.chat.DTOs.response.AccountResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import com.project.supershop.features.chat.services.IAccountChatService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AccountChatService implements IAccountChatService {

    private final AccountRepositories accountRepositories;

    private final Mapper<Account, AccountResponse> accountMapper;

    public AccountChatService (AccountRepositories accountRepositories, Mapper<Account, AccountResponse> accountMapper) {
        this.accountRepositories = accountRepositories;
        this.accountMapper = accountMapper;
    }


    @Override
    public Account getAccountById(UUID accountId) {
        return accountRepositories.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
    }

    @Override
    public AccountResponse findByEmail(String email) {
        Account account = accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with email: " + email));
        return accountMapper.mapTo(account);
    }

}
