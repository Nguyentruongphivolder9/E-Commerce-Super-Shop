package com.project.supershop.features.chat.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.request.MessageRequest;
import javax.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "messages")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Message extends BaseEntity {

    @Nullable
    private String body;

    @Nullable
    private String image;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonBackReference
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Account sender;

    public static Message createMessage(MessageRequest messageRequest){

        return Message.builder()
                .body(messageRequest.getBody())
                .image(messageRequest.getImage())
                .build();
    }
}
