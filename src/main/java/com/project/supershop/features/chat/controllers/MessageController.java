package com.project.supershop.features.chat.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.chat.DTOs.request.MessageRequest;
import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.chat.services.IMessageService;
import com.project.supershop.handler.UnprocessableException;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class MessageController {
    private final IMessageService messageService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    public MessageController(
            IMessageService messageService,
            SimpMessagingTemplate simpMessagingTemplate) {
        this.messageService = messageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @RequestMapping(value = "/send_message", method = RequestMethod.POST)
    public ResponseEntity<ResultResponse<MessageResponse>> sendMessage(
            @RequestBody MessageRequest messageRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false)
            String jwtToken) {
        // Send message
        MessageResponse messageResponse = messageService
                .sendMessage(messageRequest, jwtToken);

        return ResponseEntity.ok(ResultResponse.<MessageResponse>builder()
                .body(messageResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Send message successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping(value = "/update_message/{message_id}", method = RequestMethod.PATCH)
    public ResponseEntity<ResultResponse<MessageResponse>> updateMessage(
            @PathVariable(name = "message_id") UUID messageId,
            @RequestBody MessageRequest messageRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        // Update message
        MessageResponse messageResponse = messageService
                .updateMessage(messageId, messageRequest, jwtToken);
        return ResponseEntity.ok(ResultResponse.<MessageResponse>builder()
                .body(messageResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Update message successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping(value = "/delete_message/{message_id}", method = RequestMethod.DELETE)
    public ResponseEntity<ResultResponse<String>> deleteMessage(
            @PathVariable(name = "message_id") UUID messageId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        messageService.deleteMessage(messageId, jwtToken);
        return ResponseEntity.ok(ResultResponse.<String>builder()
                .body("Delete message successfully")
                .timeStamp(LocalDateTime.now().toString())
                .message("Delete message successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping(value = "/get_message/{message_id}", method = RequestMethod.GET)
    public ResponseEntity<ResultResponse<MessageResponse>> getMessageById(
            @PathVariable(name = "message_id") UUID messageId) {
        MessageResponse messageResponse = messageService.getMessageById(messageId)
                .orElseThrow(() -> new UnprocessableException("Message not found"));
        return ResponseEntity.ok(ResultResponse.<MessageResponse>builder()
                .body(messageResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get message by id successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping(value="/get_messages/{conversation_id}", method = RequestMethod.GET)
    public ResponseEntity<ResultResponse<List<MessageResponse>>> getMessagesByConversationId(
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("conversation_id") String conversation_id,
            final Pageable pageable) {

        List<MessageResponse> messageResponses = messageService
                .getMessagesByConversationId(UUID.fromString(conversation_id));

        ResultResponse<List<MessageResponse>> response = ResultResponse.<List<MessageResponse>>builder()
                .body(messageResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get messages by conversation by id successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    //Test
    @RequestMapping(value = "/get_all_messages", method = RequestMethod.GET)
    public ResponseEntity<Page<MessageResponse>> getAllMessages(final Pageable pageable) {
        return new ResponseEntity<>(messageService.getMessage(pageable), HttpStatus.OK);
    }
}
