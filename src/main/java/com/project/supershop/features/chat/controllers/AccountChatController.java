package com.project.supershop.features.chat.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.response.AccountResponse;
import com.project.supershop.features.chat.services.IAccountChatService;
import com.project.supershop.features.chat.services.IConversationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class AccountChatController {

    private final IConversationService conversationService;

    private final IAccountChatService accountChatService;

    public AccountChatController(
            IConversationService conversationService,
            IAccountChatService accountChatService) {
        this.conversationService = conversationService;
        this.accountChatService = accountChatService;
    }

    @RequestMapping( value = "/account/{account_id}", method = RequestMethod.GET)
    public ResponseEntity<ResultResponse<Account>> getAccountById(
            @PathVariable("account_id") UUID account_id,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        return ResponseEntity.ok(ResultResponse.<Account>builder()
                .body(accountChatService.getAccountById(account_id))
                .timeStamp(LocalDateTime.now().toString())
                .message("Get account successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value = "/account/email/{account_email}", method = RequestMethod.GET)
    public ResponseEntity<ResultResponse<AccountResponse>> getAccountByEmail(
            @PathVariable("account_email") String account_email,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        return ResponseEntity.ok(ResultResponse.<AccountResponse>builder()
                .body(accountChatService.findByEmail(account_email))
                .timeStamp(LocalDateTime.now().toString())
                .message("Get account by email successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping(value = "/other_accounts/{conversation_id}", method = RequestMethod.GET)
    public ResponseEntity<ResultResponse<List<Account>>> getOtherAccounts(
            @PathVariable("conversation_id") UUID conversation_id,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        return ResponseEntity.ok(ResultResponse.<List<Account>>builder()
                .body(conversationService.getOtherAccounts(conversation_id, jwtToken))
                .timeStamp(LocalDateTime.now().toString())
                .message("Get other accounts successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }
}
