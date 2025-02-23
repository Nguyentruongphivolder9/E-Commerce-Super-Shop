package com.project.supershop.features.chat.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.services.JwtTokenService;

import com.project.supershop.features.chat.DTOs.request.ConversationRequest;
import com.project.supershop.features.chat.DTOs.response.ConversationResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.repositories.ConversationRepository;
import com.project.supershop.features.chat.services.IConversationService;
import com.project.supershop.features.chat.services.IWebSocketService;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConversationService implements IConversationService {

    private final ConversationRepository conversationRepository;

    private final AccountRepositories accountRepositories;

    private final JwtTokenService jwtTokenService;

    private final Mapper<Conversation, ConversationResponse> conversationMapper;

    private final IWebSocketService webSocketService;

    public ConversationService(
            ConversationRepository conversationRepository,
            AccountRepositories accountRepositories,
            JwtTokenService jwtTokenService,
            Mapper<Conversation, ConversationResponse> conversationMapper,
            IWebSocketService webSocketService) {
        this.conversationRepository = conversationRepository;
        this.accountRepositories = accountRepositories;
        this.jwtTokenService = jwtTokenService;
        this.conversationMapper = conversationMapper;
        this.webSocketService = webSocketService;

    }

    @Override
    public List<Account> getOtherAccounts (UUID conversationId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }
        //Get the conversation
        Conversation conversation = conversationRepository
                .findByConversationId(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        //Get the list other account
        return conversation.getAccount().stream()
                .filter(account -> !account.equals(currentAccount))
                .collect(Collectors.toList());

    }

    @Override
    public ConversationResponse getConversationById(UUID conversationId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        Conversation conversation = conversationRepository
                .findByConversationId(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        return conversationMapper.mapTo(conversation);
    }

    @Override
    @Transactional
    public ConversationResponse createGroupConversation(ConversationRequest conversationRequest, String jwtToken) {
        // Get current account
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        // Validate conversation request
        validateConversationRequest(conversationRequest);

        // Fetch and validate accounts
        List<Account> members = fetchAndValidateAccounts(conversationRequest.getAccountEmails(), true);

        // Add current account to the list of members
        if (!members.contains(currentAccount)) {
            members.add(currentAccount);
        }

        //Create and save the conversation
        Conversation conversation = createAndSaveConversation(conversationRequest, members);

        //Implement the websocket to send the message to the group members
        webSocketService.notifyUserOfNewConversation(members, conversation);

        return conversationMapper.mapTo(conversation);
    }

    @Override
    @Transactional
    public ConversationResponse createPrivateConversation (
            ConversationRequest conversationRequest,
            String jwtToken) {
        // Get current account
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        // Validate that there is exactly one account ID for a private conversation
        validateConversationRequest(conversationRequest);

        //Validate that currentAccount is not the same as the account in the conversation request
        if(conversationRequest.getAccountEmails().get(0).equals(currentAccount.getEmail())){
            throw new UnprocessableException("You cannot create a conversation with yourself");
        }

        // Fetch and validate the account
        Account account = fetchAndValidateAccounts(conversationRequest.getAccountEmails(), false).get(0);

        // Check if conversation already exists
        Optional<Conversation> existingConversation = conversationRepository
                .getConversationByIdAndAccountId(account.getId(), currentAccount.getId());

        // If conversation already exists, return it
        if(existingConversation.isPresent())
            return conversationMapper.mapTo(existingConversation.get());

        //Create and save the conversation
        Conversation newConversation = createAndSaveConversation(conversationRequest, List.of(currentAccount, account));

        //Notify both users about the new conversation
        webSocketService.notifyUserOfNewConversation(List.of(currentAccount, account), newConversation);

        return conversationMapper.mapTo(newConversation);
    }

    @Override
    @Transactional
    public void deleteConversation(String jwtToken, UUID conversationId) {
        // Validate current account
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if (currentAccount == null) {
            throw new UnprocessableException("Invalid token");
        }

        // Fetch and validate conversation
        Conversation conversation = conversationRepository.findByConversationId(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        // Check if current account is a member of the conversation
        if (!conversation.getAccount().contains(currentAccount)) {
            throw new UnprocessableException("You are not a member of this conversation");
        }

        // Notify all members of the conversation that the conversation has been deleted
        //Url: /user/{accountId}/queue/conversation/delete
        webSocketService.notifyUserOfDeleteConversation(conversation.getAccount(), conversation);

        // Delete the conversation
        conversationRepository.delete(conversation);
    }

    @Override
    @Transactional
    public ConversationResponse updateGroupConversation (
            String id,
            ConversationRequest conversationRequest,
            String jwtToken) {
        // Get current account
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        // Validate conversation request
        validateConversationRequest(conversationRequest);

        // Fetch and validate accounts
        List<Account> members = fetchAndValidateAccounts(conversationRequest.getAccountEmails(), true);

        // Add current account to the list of members
        if (!members.contains(currentAccount)) {
            members.add(currentAccount);
        }

        return conversationRepository.findById(UUID.fromString(id))
                .map(existingConversation -> {
                    // Update fields
                    Optional.ofNullable(conversationRequest.getName()).ifPresent(existingConversation::setName);
                    Optional.ofNullable(conversationRequest.getIsGroup()).ifPresent(existingConversation::setIsGroup);
                    existingConversation.setAccount(members);

                    // Save updated conversation
                    conversationRepository.save(existingConversation);

                    // Notify members about the updated conversation
                    webSocketService.notifyUserOfUpdateConversation(members, existingConversation);

                    return conversationMapper.mapTo(existingConversation);
                })
                .orElseThrow(() -> new NotFoundException("Conversation does not exist"));
    }

    @Override
    @Transactional
    public ConversationResponse updatePrivateConversation (
            String id,
            ConversationRequest conversationRequest,
            String jwtToken) {
        // Get current account
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        // Validate conversation request
        validateConversationRequest(conversationRequest);

        // Fetch and validate accounts
        List<Account> members = fetchAndValidateAccounts(conversationRequest.getAccountEmails(), false);

        // Add current account to the list of members
        if (!members.contains(currentAccount)) {
            members.add(currentAccount);
        }

        return conversationRepository.findById(UUID.fromString(id))
                .map(existingConversation -> {
                    // Update fields
                    Optional.ofNullable(conversationRequest.getName()).ifPresent(existingConversation::setName);
                    Optional.ofNullable(conversationRequest.getIsGroup()).ifPresent(existingConversation::setIsGroup);
                    existingConversation.setAccount(members);

                    // Save updated conversation
                    conversationRepository.save(existingConversation);

                    // Notify members about the updated conversation
                    webSocketService.notifyUserOfUpdateConversation(members, existingConversation);

                    return conversationMapper.mapTo(existingConversation);
                })
                .orElseThrow(() -> new NotFoundException("Conversation does not exist"));
    }

    @Override
    public Page<ConversationResponse> getConversations(Pageable pageable, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        return conversationRepository
                .findConversationsByAccountId(pageable, currentAccount.getId())
                .map(conversationMapper::mapTo);
    }

    //Validate conversation request
    private void validateConversationRequest(@NotNull ConversationRequest conversationRequest) {
        if (conversationRequest.getIsGroup()) {
            if (conversationRequest.getAccountEmails().size() < 2 || conversationRequest.getName() == null) {
                throw new UnprocessableException("Invalid data for group conversation: must have at least 2 members and a name");
            }
        } else {
            if (conversationRequest.getAccountEmails().size() != 1) {
                throw new UnprocessableException("Invalid data for private conversation: must have exactly one account email.");
            }
        }
    }

    //Fetch and validate accounts
    private List<Account> fetchAndValidateAccounts(
            List<String> accountEmails,
            boolean isGroup) {
        if (isGroup) {
            return accountEmails.stream()
                    .map(email -> accountRepositories
                            .findAccountByEmail(email)
                            .orElseThrow(() -> new UnprocessableException("Account not found for email: " + email)))
                    .collect(Collectors.toList());
        } else {
            return List.of(accountRepositories
                    .findAccountByEmail(accountEmails.get(0))
                    .orElseThrow(() -> new UnprocessableException("Account not found for email: " + accountEmails.get(0))));
        }
    }

    //Create and save the conversation
    private @NotNull Conversation createAndSaveConversation(
            ConversationRequest conversationRequest,
            @NotNull List<Account> members) {
        Conversation conversation = Conversation.createConversation(conversationRequest);
        conversation.setIsGroup(members.size() > 2);
        conversation.setAccount(members);
        return conversationRepository.save(conversation);
    }

}
