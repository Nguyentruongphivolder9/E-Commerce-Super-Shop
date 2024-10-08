package com.project.supershop.features.chat.mappers.impl;

import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import com.project.supershop.features.chat.mappers.Mapper;
import com.project.supershop.features.chat.models.Message;
import org.modelmapper.ModelMapper;

import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper implements Mapper<Message, MessageResponse> {

    private final ModelMapper modelMapper;

    public MessageMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configureMappings();
    }

    private void configureMappings() {

        // Enable field matching for private fields and other configurations
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Custom TypeMap for mapping Conversation to ConversationResponse
        TypeMap<Message, MessageResponse> typeMap = modelMapper
                .createTypeMap(Message.class, MessageResponse.class);

        //Custom Converter for Conversation to String
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getConversation().getId(), MessageResponse::setConversationId));

        //Custom Converter for Account to String
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getSender().getId(), MessageResponse::setSenderId));
    }

    @Override
    public MessageResponse mapTo(Message message) {
        return modelMapper.map(message, MessageResponse.class);
    }

    @Override
    public Message mapFrom(MessageResponse messageResponse) {
        return modelMapper.map(messageResponse, Message.class);
    }
}
