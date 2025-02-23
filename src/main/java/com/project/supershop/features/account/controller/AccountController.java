package com.project.supershop.features.account.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.supershop.features.account.domain.dto.request.AccountRequest;
import com.project.supershop.features.account.domain.dto.request.AccountUpdateRequest;
import com.project.supershop.features.account.domain.dto.request.LogoutRequest;
import com.project.supershop.features.account.domain.dto.response.DeviceResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.account.services.DeviceService;
import com.project.supershop.features.auth.domain.dto.request.RegisterRequest;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.transform.Result;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    private final AccountService accountService;
    private final DeviceService deviceService;
    private final AccessTokenService accessTokenService;
    private final SecretKeyProvider secretKeyProvider;
    private final JwtTokenService jwtTokenService;

    public AccountController(DeviceService deviceService, AccessTokenService accessTokenService, JwtTokenService jwtTokenService, SecretKeyProvider secretKeyProvider, AccountService accountService) {
        this.accountService = accountService;
        this.secretKeyProvider = secretKeyProvider;
        this.jwtTokenService = jwtTokenService;
        this.accessTokenService = accessTokenService;
        this.deviceService = deviceService;
    }


    @PostMapping("/set-account-online")
    public ResponseEntity<ResultResponse<?>> setAccountOnline(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader(value = "Email", required = true) String email,
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo

    ) throws JsonProcessingException {
        Device device = new ObjectMapper().readValue(deviceInfo, Device.class);
        String token = getAuthorizationHeader(authorizationHeader);
        try {
            accountService.curretlyOnline(email);
            return ResponseEntity.ok(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(true)
                            .message("Account is now online")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    ResultResponse.<String>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/set-account-offline")
    public ResponseEntity<ResultResponse<?>> setAccountOffline(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader(value = "Email", required = true) String email,
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo
    ) throws JsonProcessingException {
        Device device = new ObjectMapper().readValue(deviceInfo, Device.class);
        String token = getAuthorizationHeader(authorizationHeader);
        try {
            accountService.currentlyOffine(email);
            return ResponseEntity.ok(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Account is now offline")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    ResultResponse.<String>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ResultResponse<List<Account>>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();

        return ResponseEntity.ok(
                ResultResponse.<List<Account>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accounts)
                        .message("Received all accounts successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/get-account-by-id/{accountId}")
    public ResponseEntity<ResultResponse<?>> getAccountByAccountId(@PathVariable UUID accountId) {
        Account account = accountService.findAccountById(accountId);
        return ResponseEntity.ok(
                ResultResponse.<Account>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(account)
                        .message("Received account successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/get-all-devices-by-accessToken")
    public ResponseEntity<ResultResponse<?>> getAllDeviceByAccessToken(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("Account-Id") UUID accountId
    ) {
        String token = getAuthorizationHeader(authorizationHeader);
        try {

            List<DeviceResponse> deviceList = new ArrayList<>(accessTokenService.getAllDeviceByAccessToken(token, accountId));

            return ResponseEntity.ok(
                    ResultResponse.<List<DeviceResponse>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(deviceList)
                            .message("Fetch all devices by accessToken token successfully.")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<List<Account>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error fetching device by accessToken " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }

    }

    @PostMapping("/account-logout")
    public ResponseEntity<ResultResponse<?>> accountLogout(@RequestBody LogoutRequest logoutRequest, @RequestHeader("Authorization") String authorizationHeader, @RequestHeader(value = "Device-Finger-Print", required = true) String deviceFingerPrint
    ) {
        String token = getAuthorizationHeader(authorizationHeader);
        String deviceInfo = deviceFingerPrint;
        try {
            accountService.logoutAccount(logoutRequest.getEmail(), token, deviceFingerPrint);
            return ResponseEntity.ok(
                    ResultResponse.<List<Account>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Account with email: " + logoutRequest.getEmail() + " logged out successfully")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<List<Account>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error logging out: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/update-user-account-info")
    public ResponseEntity<ResultResponse<JwtResponse>> accountUpdate(
            @RequestBody AccountUpdateRequest accountRequest,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader(value = "Device-Info") String deviceInfo
    ) {
        try {
            Device device = deviceService.saveDevice(new ObjectMapper().readValue(deviceInfo, Device.class));
            System.out.print("======================> Processing heere");
            String token = getAuthorizationHeader(authorizationHeader);

            JwtResponse jwtResponse = accountService.updateAccount(accountRequest, token, device);

            return ResponseEntity.created(URI.create("")).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(org.joda.time.LocalDateTime.now().toString())
                            .body(jwtResponse)
                            .message("Account updated successfully")
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.created(URI.create("")).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(org.joda.time.LocalDateTime.now().toString())
                            .body(null)
                            .message("Account update failed" + e.getMessage())
                            .status(HttpStatus.EXPECTATION_FAILED)
                            .statusCode(HttpStatus.EXPECTATION_FAILED.value())
                            .build());
        }

    }

    public String getAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        return authorizationHeader.substring(7);
    }


}
