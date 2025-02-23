package com.project.supershop.features.chat.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MessageResponse {
    private String id;
    private String body;
    private String image;
    private String conversationId;
    private String senderId;
//    private List<String> seenAccountIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
