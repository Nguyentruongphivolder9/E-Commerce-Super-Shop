package com.project.supershop.features.chat.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.chat.DTOs.request.ConversationRequest;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Conversation extends BaseEntity {

    @Nullable
    private String name;

    @Nullable
    private Boolean isGroup;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Message> messages;

    @ManyToMany
    @JoinTable(
            name = "conversation_accounts",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    private List<Account> account;

    public static Conversation createConversation(ConversationRequest conversationRequest){
        return Conversation.builder()
                .name(conversationRequest.getName())
                .isGroup(conversationRequest.getIsGroup())
                .messages(new ArrayList<>())
                .account(null)
                .build();
    }

    public void addMessage(Message message) {
        messages.add(message);
        message.setConversation(this); // Establish bidirectional relationship
    }

    public void removeMessage(Message message) {
        messages.remove(message);
        message.setConversation(null); // Nullify the conversation reference in the message
    }

}
