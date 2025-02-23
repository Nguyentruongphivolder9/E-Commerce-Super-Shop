package com.project.supershop.features.chat.DTOs.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageRequest {

    @Nullable
    private String body;
    @Nullable
    private String image;
    @NotNull
    private String conversationId;

}
