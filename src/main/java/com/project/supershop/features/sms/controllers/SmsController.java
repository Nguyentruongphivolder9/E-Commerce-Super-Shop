package com.project.supershop.features.sms.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@RestController
public class SmsController {
    @Value("${sms.account-id}")
    private String SMS_ACCOUNT_ID;
    @Value("${sms.auth-token}")
    private String SMS_AUTH_TOKEN;
    @Value("${sms.phone-number}")
    private String SMS_PHONE_NUMBER;


    @PostMapping(value = "/send-OTP-for-reset-password")
    public ResponseEntity<ResultResponse<?>> sendSMS(
            @RequestHeader(value = "Phone-Number", required = true) String phoneNumber
    ) {
        if (phoneNumber.isEmpty()) {
            throw new RuntimeException("Your phone number is empty");
        }
        Twilio.init(System.getenv(SMS_ACCOUNT_ID), System.getenv(SMS_AUTH_TOKEN));

        Message.creator(new PhoneNumber(phoneNumber),
                new PhoneNumber(SMS_PHONE_NUMBER), "Hello from Twilio 📞").create();
        return ResponseEntity.ok(
                ResultResponse.<String>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(null)
                        .message("OTP Message sent successfully!")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }
}
