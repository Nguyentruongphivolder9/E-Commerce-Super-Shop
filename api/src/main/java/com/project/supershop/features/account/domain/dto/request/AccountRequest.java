package com.project.supershop.features.account.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountRequest {

    @Pattern(regexp = "ADMIN|USER|SELLER")
    private String roleName = "USER";

    @NotBlank(message = "User name can't be blank")
    @NotNull(message = "User name can't be left empty")
    private String userName;

    private String password;

    private String confirmPassword;

    @NotBlank(message = "User full name can't be blank")
    @NotNull(message = "User full name can't be left empty")
    private String fullName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "User email can't be blank")
    @NotNull(message = "User email can't be left empty")
    private String email;

    @NotBlank(message = "User phone number can't be blank")
    @NotNull(message = "User phone number can't be left empty")
    private String phoneNumber;

    private LocalDateTime birthDay;

    @NotNull(message = "User gender can't be left empty")
    private String gender;

    private Boolean isActive;
    private Boolean isEnable;
}
