package com.project.supershop.features.chat.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.response.ConversationResponse;
import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.chat.services.IWebSocketService;
import org.jetbrains.annotations.NotNull;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import static com.project.supershop.features.chat.constants.WebSocketConstants.*;

import java.util.List;

@Service
public class WebSocketService implements IWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    private final Mapper<Message, MessageResponse> messageMapper;

    private final Mapper<Conversation, ConversationResponse> conversationMapper;

    public WebSocketService(
            SimpMessagingTemplate messagingTemplate,
            Mapper<Conversation, ConversationResponse> conversationMapper,
            Mapper<Message, MessageResponse> messageMapper) {
        this.messagingTemplate = messagingTemplate;
        this.conversationMapper = conversationMapper;
        this.messageMapper = messageMapper;
    }

    //Subscribe private url: /user/{accountId}/conversation/new
    @Override
    public void notifyUserOfNewConversation(@NotNull List<Account> members, Conversation conversation) {
        members.forEach(member -> messagingTemplate.convertAndSendToUser(
//                member.getEmail(),
                member.getId().toString(),
                CONVERSATION_NEW,
                conversationMapper.mapTo(conversation)));
    }

    //Subscribe private url: /user/{accountEmail}/conversation/update
    @Override
    public void notifyUserOfUpdateConversation (@NotNull List<Account> members, Conversation conversation) {
        for (Account member : members) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(member.getId()),
                    CONVERSATION_UPDATE,
                    conversationMapper.mapTo(conversation)
            );
        }
    }

    //Subscribe private url: /user/{accountEmail}/conversation/delete
    @Override
    public void notifyUserOfDeleteConversation (@NotNull List<Account> members, Conversation conversation) {
        members.forEach(member -> messagingTemplate.convertAndSendToUser(
//                member.getEmail(),
                member.getId().toString(),
                CONVERSATION_DELETE,
                conversationMapper.mapTo(conversation)));
    }

    // Subscribe public url:              /topic/conversation/{conversationId}/message/new if isGroup is true
    // Subscribe private url: /user/{accountEmail}/conversation/{conversationId}/message/new if isGroup is false
    @Override
    public void notifyNewMessage(
            Conversation conversation,
            Message message,
            boolean isGroup) {
        String destination = isGroup
                ? "/topic/conversation/" + conversation.getId() + MESSAGE_NEW
                : "/conversation/" + conversation.getId() + MESSAGE_NEW;

        if (isGroup) {
            messagingTemplate.convertAndSend(destination, messageMapper.mapTo(message));
        } else {
            conversation.getAccount()
//                    .filter(account -> !account.getId().equals(message.getSender().getId()))
                    .forEach(account -> messagingTemplate.convertAndSendToUser(
//                            account.getEmail(),
                            account.getId().toString(),
                            destination,
                            messageMapper.mapTo(message)
                    ));
        }
    }

    // Subscribe public url:              /topic/conversation/{conversationId}/message/delete if isGroup is true
    // Subscribe private url: /user/{accountEmail}/conversation/{conversationId}/message/delete if isGroup is false
    @Override
    public void notifyDeleteMessage (Conversation conversation, Message message, boolean isGroup) {
        String destination = isGroup
                ? "/topic/conversation/" + conversation.getId() + MESSAGE_DELETE
                : "/conversation/" + conversation.getId() + MESSAGE_DELETE;

        if (isGroup) {
            messagingTemplate.convertAndSend(destination, messageMapper.mapTo(message));
        } else {
            conversation.getAccount()
//                    .filter(account -> !account.getId().equals(message.getSender().getId()))
                    .forEach(account -> messagingTemplate.convertAndSendToUser(
//                            account.getEmail(),
                            account.getId().toString(),
                            destination,
                            messageMapper.mapTo(message)
                    ));
        }
    }

    // Subscribe public url:              /topic/conversation/{conversationId}/message/update if isGroup is true
    // Subscribe private url: /user/{accountEmail}/conversation/{conversationId}/message/update if isGroup is false
    @Override
    public void notifyUpdateMessage (Conversation conversation, Message message, boolean isGroup) {
        String destination = isGroup
                ? "/topic/conversation/" + conversation.getId() + MESSAGE_UPDATE
                : "/conversation/" + conversation.getId() + MESSAGE_UPDATE;

        if (isGroup) {
            messagingTemplate.convertAndSend(destination, messageMapper.mapTo(message));
        } else {
            conversation.getAccount()
//                    .filter(account -> !account.getId().equals(message.getSender().getId()))
                    .forEach(account -> messagingTemplate.convertAndSendToUser(
//                            account.getEmail(),
                            account.getId().toString(),
                            destination,
                            messageMapper.mapTo(message)
                    ));
        }
    }
}
