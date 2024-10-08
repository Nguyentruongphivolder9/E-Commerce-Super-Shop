package com.project.supershop.features.auth.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailVerficationResponse {
    private String type;
    private String email;
    private String message;

}
