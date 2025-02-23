package com.project.supershop.features.chat.services;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.models.Message;

import java.util.List;

public interface IWebSocketService {

    //Subscribe public url: /topic/**
    //Subscribe private url: /user/{accountId}/**

    //Subscribe private url: /user/{accountId}/conversation/new
    void notifyUserOfNewConversation (List<Account> members, Conversation conversation);

    //Subscribe private url: /user/{accountId}/conversation/update
    void notifyUserOfUpdateConversation (List<Account> members, Conversation conversation);

    //Subscribe private url: /user/{accountId}/conversation/delete
    void notifyUserOfDeleteConversation (List<Account> members, Conversation conversation);

    // Subscribe public url:              /topic/conversation/{conversationId}/message/new
    // Subscribe private url: /user/{accountId}/conversation/{conversationId}/message/new
    void notifyNewMessage (Conversation conversation, Message message, boolean isGroup);

    // Subscribe public url:              /topic/conversation/{conversationId}/message/delete if isGroup is true
    // Subscribe private url: /user/{accountId}/conversation/{conversationId}/message/delete if isGroup is false
    void notifyDeleteMessage (Conversation conversation, Message message, boolean isGroup);

    // Subscribe public url:              /topic/conversation/{conversationId}/message/update if isGroup is true
    // Subscribe private url: /user/{accountId}/conversation/{conversationId}/message/update if isGroup is false
    void notifyUpdateMessage (Conversation conversation, Message message, boolean isGroup);
}
