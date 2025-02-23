package com.project.supershop.features.auth.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.supershop.common.BaseEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequest{

    @Pattern(regexp = "ADMIN|USER|SELLER", message = "Invalid role name")
    private String role_name;

    @NotBlank(message = "User name can't be blank")
    @NotNull(message = "User name can't be left empty")
    private String user_name;

    @NotBlank(message = "Password can't be blank")
    @NotNull(message = "Password can't be left empty")
    private String password;

    @NotBlank(message = "User full name can't be blank")
    @NotNull(message = "User full name can't be left empty")
    private String full_name;

    @NotBlank(message = "Email can't be blank")
    @NotNull(message = "Email can't be left empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number can't be blank")
    @NotNull(message = "Phone number can't be left empty")
    private String phone_number;

    @NotNull(message = "Birthday can't be left empty")
    private String birth_day;

    @NotNull(message = "User gender can't be left empty")
    private String gender;

    private boolean isActive = false;
    private boolean isEnable;

    private String avatar;
}
