package com.project.supershop.features.chat.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.chat.DTOs.request.MessageRequest;
import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import com.project.supershop.features.chat.mappers.Mapper;

import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.chat.repositories.ConversationRepository;
import com.project.supershop.features.chat.repositories.MessageRepository;
import com.project.supershop.features.chat.services.IMessageService;
import com.project.supershop.features.chat.services.IWebSocketService;
import com.project.supershop.handler.UnprocessableException;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MessageService implements IMessageService {

    private final JwtTokenService jwtTokenService;

    private final ConversationRepository conversationRepository;

    private final MessageRepository messageRepository;

    private final Mapper<Message, MessageResponse> messageMapper;

    private final IWebSocketService webSocketService;

    public MessageService(
            JwtTokenService jwtTokenService,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            Mapper<Message, MessageResponse> messageMapper,
            IWebSocketService webSocketService) {
        this.jwtTokenService = jwtTokenService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.webSocketService = webSocketService;
    }

    @Override
    public Optional<MessageResponse> getMessageById (UUID messageId) {
        return messageRepository.findById(messageId)
                .map(messageMapper::mapTo);
    }

    @Override
    @Transactional
    public MessageResponse sendMessage(MessageRequest messageRequest, String jwtToken) {
        //get current user
        Account currentUser = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        //validate message request
        validateMessageRequest(messageRequest);

        //get conversation
        Conversation updatedConversation =
                checkConversationExistence(UUID.fromString(messageRequest.getConversationId()));

        //create new message
        Message newMessage = Message.createMessage( messageRequest );
        newMessage.setConversation(updatedConversation);
        newMessage.setSender(currentUser);
//        newMessage.setSeen(List.of(currentUser));

        messageRepository.save(newMessage);

        //update conversation
        updatedConversation.setUpdatedAt(newMessage.getCreatedAt());
        updatedConversation.addMessage(newMessage);
        conversationRepository.save(updatedConversation);

        // Subscribe public url: /topic/conversation/{conversationId}/messages
        // Subscribe private url: /user/queue/conversation/{conversationId}/messages
        webSocketService.notifyNewMessage(updatedConversation, newMessage, false);

        return messageMapper.mapTo(newMessage);
    }

    @Override
    @Transactional
    public MessageResponse updateMessage (UUID messageId, MessageRequest messageRequest, String jwtToken) {

        //get current user
        Account currentUser = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        Message updatemessage = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!updatemessage.getSender().getId().equals(currentUser.getId())) {
            throw new UnprocessableException("You are not the sender of this message");
        }

        Conversation conversation = conversationRepository
                .findByConversationId(UUID.fromString(messageRequest.getConversationId()))
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Optional.ofNullable(messageRequest.getBody()).ifPresent(updatemessage::setBody);
        Optional.ofNullable(messageRequest.getImage()).ifPresent(updatemessage::setImage);
//        Optional.ofNullable(messageRequest.getSeen()).ifPresent(message::setSeen);

        messageRepository.save(updatemessage);

        //notify the updated message
        webSocketService.notifyUpdateMessage(conversation, updatemessage, false);

        return messageMapper.mapTo(updatemessage);
    }

    @Override
    public void deleteMessage (UUID messageId, String jwtToken) {

        //get message
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        //update conversation
        Conversation conversation = message.getConversation();
        conversation.getMessages().remove(message);
        conversationRepository.save(conversation);

        messageRepository.delete(message);

        webSocketService.notifyDeleteMessage(conversation, message, false);
    }

    @Override
    public List<MessageResponse> getMessagesByConversationId(
            UUID conversationId) {
        List<Message> messages = messageRepository
                .findMessageByConversationIdOrderByCreatedAtAsc(conversationId);

        return messages.stream()
                .map(messageMapper::mapTo)
                .toList();
    }

    @Override
    public Page<MessageResponse> getMessage ( final Pageable pageable ) {
        return messageRepository.findAll(pageable)
                .map(messageMapper::mapTo);
    }

    private void validateMessageRequest(@NotNull MessageRequest messageRequest) {
        if(messageRequest.getConversationId().isEmpty()){
            throw new UnprocessableException("Invalid data for message: must have a conversation id");
        }
    }

    private Conversation checkConversationExistence(UUID conversationId) {
        return conversationRepository.findByConversationId(conversationId)
                .orElseThrow(() -> new UnprocessableException("Conversation not found"));
    }

}
