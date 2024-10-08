package com.project.supershop.features.chat.mappers.impl;

import com.project.supershop.features.account.domain.entities.Account;

import com.project.supershop.features.chat.DTOs.response.ConversationResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.models.Message;
import org.modelmapper.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConversationMapper implements Mapper<Conversation, ConversationResponse> {

    private final ModelMapper modelMapper;

    public ConversationMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configureMappings();
    }

    private void configureMappings() {
        // Enable field matching for private fields and other configurations
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Custom TypeMap for mapping Conversation to ConversationResponse
        TypeMap<Conversation, ConversationResponse> typeMap = modelMapper
                .createTypeMap(Conversation.class, ConversationResponse.class);

        // Custom Converter for List<Account> to List<String>
        typeMap.addMappings(mapper ->
                mapper.using(new AccountsListConverter( ))
                        .map(Conversation::getAccount, ConversationResponse::setAccountIds)
        );
        typeMap.addMappings(mapper ->
                mapper.using(new MessagesListConverter( ))
                        .map(Conversation::getMessages, ConversationResponse::setMessageIds)
        );
    }

    // Custom converter to map List<Account> to List<String>
    private static class AccountsListConverter extends AbstractConverter<List<Account>, List<String>> {
        @Override
        protected List<String> convert(List<Account> accounts) {
            return accounts.stream()
                    .map(account -> account.getId().toString()) // Convert UUID to String
                    .collect(Collectors.toList());
        }
    }

    // Custom converter to map List<Message> to List<String>
    private static class MessagesListConverter extends AbstractConverter<List<Message>, List<String>> {
        @Override
        protected List<String> convert(List<Message> messages) {
            return messages.stream()
                    .map(message -> message.getId().toString()) // Convert UUID to String
                    .collect(Collectors.toList());
        }
    }

    @Override
    public ConversationResponse mapTo(Conversation conversation) {
        return modelMapper.map(conversation, ConversationResponse.class);
    }

    @Override
    public Conversation mapFrom(ConversationResponse conversationResponse) {
        return modelMapper.map(conversationResponse, Conversation.class);
    }


}
