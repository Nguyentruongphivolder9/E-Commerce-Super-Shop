package com.project.supershop.features.chat.services;

import com.project.supershop.features.chat.DTOs.request.MessageRequest;
import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IMessageService {

    Optional<MessageResponse> getMessageById (UUID messageId);

    MessageResponse sendMessage (MessageRequest messageRequest, String jwtToken);

    MessageResponse updateMessage (UUID messageId, MessageRequest messageRequest, String jwtToken);

    void deleteMessage (UUID messageId, String jwtToken);

    List<MessageResponse> getMessagesByConversationId (UUID conversationId);
    //test
    Page<MessageResponse> getMessage (Pageable pageable);
}
