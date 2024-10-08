package com.project.supershop.features.chat.services;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.response.AccountResponse;

import java.util.UUID;

public interface IAccountChatService {
    Account getAccountById(UUID accountId);

    AccountResponse findByEmail(String email);
}
