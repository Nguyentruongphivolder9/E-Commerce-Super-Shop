package com.project.supershop.features.chat.services;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.request.ConversationRequest;
import com.project.supershop.features.chat.DTOs.response.ConversationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;


public interface IConversationService  {

    List<Account> getOtherAccounts(
            UUID conversationId,
            String jwtToken);

    ConversationResponse getConversationById(
            UUID conversationId,
            String jwtToken);

    Page<ConversationResponse> getConversations(
            Pageable pageable,
            String jwtToken);

    ConversationResponse createGroupConversation(
            ConversationRequest conversationRequest,
            String jwtToken);

    ConversationResponse createPrivateConversation(
            ConversationRequest conversationRequest,
            String jwtToken);

    void deleteConversation(
            String jwtToken,
            UUID conversationId);

    ConversationResponse updateGroupConversation (
            String id,
            ConversationRequest conversationRequest,
            String jwtToken);

    ConversationResponse updatePrivateConversation (
            String id,
            ConversationRequest conversationRequest,
            String jwtToken);
}
