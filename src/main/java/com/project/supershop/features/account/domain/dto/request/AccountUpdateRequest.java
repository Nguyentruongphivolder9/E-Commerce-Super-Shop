package com.project.supershop.features.account.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountUpdateRequest {

    private String user_name;
    private String full_name;
    private String gender;
    private String phone_number;
    private String email;
    private LocalDateTime birth_day;
    private File avatar;

}
