package com.project.supershop.features.account.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountJwtParsingResponse {
    private String email;
    private String userName;
    private String roles;
}
