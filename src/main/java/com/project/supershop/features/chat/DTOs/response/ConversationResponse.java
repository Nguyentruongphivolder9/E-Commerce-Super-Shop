package com.project.supershop.features.chat.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ConversationResponse {
    private String id;
    private String name;
    private boolean isGroup;
    private List<String> accountIds;
    private List<String> messageIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
