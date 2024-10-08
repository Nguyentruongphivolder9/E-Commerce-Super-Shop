package com.project.supershop.features.chat.controllers;


import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.chat.DTOs.request.ConversationRequest;
import com.project.supershop.features.chat.DTOs.response.ConversationResponse;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.chat.services.IConversationService;
import com.project.supershop.handler.UnprocessableException;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class ConversationController  {

    private final IConversationService conversationService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    public ConversationController(IConversationService conversationService, SimpMessagingTemplate simpMessagingTemplate) {
        this.conversationService = conversationService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/sendMessage")
    public void send(Message message) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/messages", message);
    }

    @RequestMapping( value = "/create_conversation", method = RequestMethod.POST )
    public ResponseEntity<ResultResponse<ConversationResponse>> createConversation (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @Valid @RequestBody ConversationRequest conversationRequest ) {
        //Validate conversation request
        validateConversationRequest(conversationRequest);

        //Create conversation
        ConversationResponse conversationResponse = conversationRequest.getIsGroup( ) ?
                conversationService.createGroupConversation(conversationRequest, jwtToken) :
                conversationService.createPrivateConversation(conversationRequest, jwtToken);

        //Return response
        ResultResponse<ConversationResponse> response = ResultResponse.<ConversationResponse>builder()
                .body(conversationResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Conversation created successfully")
                .statusCode(HttpStatus.CREATED.value())
                .status(HttpStatus.CREATED)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping( value = "/update_conversation/{id}", method = RequestMethod.PATCH )
    public ResponseEntity<ResultResponse<ConversationResponse>> updateConversation (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable( "id" ) String id,
            @Valid @RequestBody ConversationRequest conversationRequest ) {
        //Validate conversation request
        validateConversationRequest(conversationRequest);

        //Update conversation
        ConversationResponse conversationResponse = conversationRequest.getIsGroup( ) ?
                conversationService.updateGroupConversation(id, conversationRequest, jwtToken) :
                conversationService.updatePrivateConversation(id, conversationRequest, jwtToken);

        //Return response
        ResultResponse<ConversationResponse> response = ResultResponse.<ConversationResponse>builder()
                .body(conversationResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Conversation updated successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping( value = "/delete_conversation/{id}", method = RequestMethod.DELETE )
    public ResponseEntity<ResultResponse<String>> deleteConversation (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable( "id" ) String id ) {
        //Delete conversation
        conversationService
                .deleteConversation(jwtToken, UUID.fromString(id));

        //Return response
        ResultResponse<String> response = ResultResponse.<String>builder()
                .body("Conversation deleted successfully")
                .timeStamp(LocalDateTime.now().toString())
                .message("Conversation deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping( value = "/get_conversation/{id}", method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<ConversationResponse>> getConversation (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable( "id" ) String id ) {
        //Get conversation
        ConversationResponse conversationResponse = conversationService
                .getConversationById(UUID.fromString(id), jwtToken);

        //Return response
        ResultResponse<ConversationResponse> response = ResultResponse.<ConversationResponse>builder()
                .body(conversationResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get conversation by id successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping( value = "/get_conversations", method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<Page<ConversationResponse>>> getConversations (
            Pageable pageable,
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken ) {
        //Get conversations
        Page<ConversationResponse> conversationResponses = conversationService
                .getConversations(pageable, jwtToken);

        //Return response
        ResultResponse<Page<ConversationResponse>> response = ResultResponse.<Page<ConversationResponse>>builder()
                .body(conversationResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get list conversations successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok().body(response);
    }

    //Validate conversation request
    private void validateConversationRequest(@NotNull ConversationRequest conversationRequest) {
        if (conversationRequest.getIsGroup()) {
            if (conversationRequest.getAccountEmails().size() < 2 || conversationRequest.getName() == null)
                throw new UnprocessableException("Invalid data for group conversation: must have at least 2 members and a name");
        } else {
            if (conversationRequest.getAccountEmails().size() != 1)
                throw new UnprocessableException("Invalid data for private conversation: must have exactly one account ID");
        }
    }
}
