package com.project.supershop.features.chat.DTOs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ConversationRequest {

    private String name;
    private Boolean isGroup;
    private List<String> messageIds;
    private List<String> accountEmails;

    //private List<AccountRequest> account;
}
