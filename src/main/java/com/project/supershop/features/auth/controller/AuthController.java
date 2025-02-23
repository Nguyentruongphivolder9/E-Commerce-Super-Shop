package com.project.supershop.features.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.supershop.features.account.domain.dto.request.LogoutRequest;
import com.project.supershop.features.account.domain.dto.request.MergeAccountGoogleRequest;
import com.project.supershop.features.account.domain.dto.request.WaitingForEmailVerifyRequest;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.domain.entities.QrLogin;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.account.repositories.QrLoginRepo;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.features.account.services.DeviceService;
import com.project.supershop.features.account.services.QrLoginService;
import com.project.supershop.features.auth.domain.dto.request.EmailVerificationRequest;
import com.project.supershop.features.auth.domain.dto.request.RefreshTokenRequest;
import com.project.supershop.features.auth.domain.dto.response.EmailVerficationResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.repositories.AccessTokenRepository;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.auth.domain.dto.request.LoginRequest;
import com.project.supershop.features.auth.domain.dto.request.RegisterRequest;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.common.ResultResponse;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtTokenService jwtTokenService;
    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final AccessTokenService accessTokenService;
    private final SecretKeyProvider secretKeyProvider;
    private final DeviceService deviceService;
    private AccessTokenRepository accessTokenRepository;
    private final QrLoginService qrLoginService;
    private QrLoginRepo qrLoginRepo;
    public AuthController(
            QrLoginService qrLoginService,
            SecretKeyProvider secretKeyProvider,
            AuthenticationManager authenticationManager,
            JwtTokenService jwtTokenService,
            AccountService accountService,
            AccessTokenService accessTokenService,
            DeviceService deviceService) {
        this.secretKeyProvider = secretKeyProvider;
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.accountService = accountService;
        this.accessTokenService = accessTokenService;
        this.deviceService = deviceService;
        this.qrLoginService = qrLoginService;

    }

    @Autowired
    public void setAccessTokenRepository(AccessTokenRepository accessTokenRepository) {
        this.accessTokenRepository = accessTokenRepository;
    }

    @Autowired
    public void setQrLoginRepo(QrLoginRepo qrLoginRepo) {
        this.qrLoginRepo = qrLoginRepo;
    }

    @PostMapping("find-account-by-token")
    public ResponseEntity<ResultResponse<Account>> retrunAccountByToken(@RequestParam("token") String token) {
        Account accountFinding = null;
        try {
            accountFinding = jwtTokenService.parseJwtTokenToAccount(token);
            return ResponseEntity.ok(
                    ResultResponse.<Account>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(accountFinding)
                            .message("Found a account")
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    ResultResponse.<Account>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error finding account: " + e.getMessage())
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build()
            );
        }
    }

    @PostMapping("qr-scanner-login")
    public ResponseEntity<ResultResponse<JwtResponse>> qrScannerLogin(
            @RequestHeader(value = "Email", required = true) String email,
            @RequestHeader(value = "Code", required = true) String code,
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo
    ) throws JsonProcessingException {

        Device deviceSaved = deviceService.saveDevice(new ObjectMapper().readValue(deviceInfo, Device.class));

        QrLogin qrlogin = new QrLogin();
        qrlogin.setToken(code);
        qrlogin.setAccountIdl(accountService.findByEmail(email).getId());

        qrLoginRepo.save(qrlogin);

        JwtResponse jwtResponse = new JwtResponse();

        return ResponseEntity.ok(
                ResultResponse.<JwtResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(jwtResponse)
                        .message("Login successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/get-qr-token")
    public ResponseEntity<ResultResponse<?>> getQrToken(
            @RequestHeader(value = "Token", required = true) String token
    ) {
        QrLogin qrlogin = qrLoginService.getQrLoginByToken(token);

        if (qrlogin == null) {
            return ResponseEntity.ok(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("QR login not found")
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        }

        AccessToken accessToken = accessTokenRepository.findAccessTokenByAccountId(qrlogin.getAccountIdl());

        if (accessToken == null) {
            return ResponseEntity.ok(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("No access token found")
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        }

        // Create and populate JwtResponse
        JwtResponse jwtResponse = new JwtResponse();
        jwtResponse.setAccessToken(accessToken.getToken());
        jwtResponse.setRefreshToken(accessToken.getRefreshToken());
        jwtResponse.setExpireRefreshToken(accessToken.getExpiresIn());
        jwtResponse.setExpires(accessToken.getExpiresAt());
        jwtResponse.setSecretKey(Arrays.toString(accessToken.getSecretKey()));
        jwtResponse.setAccount(accessToken.getAccount());

        return ResponseEntity.ok(
                ResultResponse.<JwtResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(jwtResponse)
                        .message("Get QR token successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @PostMapping("/google-login-without-password")
    public ResponseEntity<ResultResponse<JwtResponse>> googleLogin(
            @RequestBody LogoutRequest logoutRequest,
            @RequestHeader(value = "Device-Finger-Print", required = true) String deviceFingerPrint,
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo
    ) throws JsonProcessingException {

        JwtResponse jwtResponse = null;

        Account accountGgleLogin = accountService.findByEmail(logoutRequest.getEmail());

        jwtResponse = jwtTokenService.createJwtResponse(accountGgleLogin);

        Device deviceSaved = deviceService.saveDevice(new ObjectMapper().readValue(deviceInfo, Device.class));

        accountService.assignDeviceToAccount(accountGgleLogin, deviceSaved, false);

        AccessToken accessToken = AccessToken.builder()
                .token(jwtResponse.getAccessToken())
                .refreshToken(jwtResponse.getRefreshToken())
                .issuedAt(System.currentTimeMillis())
                .expiresAt(jwtResponse.getExpires())
                .secretKey(secretKeyProvider.getNewSecretKey().getEncoded())
                .account(accountGgleLogin)
                .build();

        accessToken.addDevice(deviceSaved);

        accessTokenService.saveToken(accessToken);

        return ResponseEntity.ok(
                ResultResponse.<JwtResponse>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(jwtResponse)
                        .message("Authentication successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/refresh-access-token")
    public ResponseEntity<ResultResponse<?>> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        JwtResponse jwtResponse = null;
        try {
            jwtResponse = accountService.refreshToken(refreshTokenRequest.getRefreshToken());

            return ResponseEntity.ok(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(jwtResponse)
                            .message("Authentication successfully")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResultResponse.<Void>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error refresh token: " + e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }
    }

    @PostMapping("/send-login-verification")
    public ResponseEntity<ResultResponse<?>> loginVerification(
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo,
            @RequestHeader(value = "Email-info", required = true) String email,
            @RequestHeader(value = "Device-Finger-Print", required = true) String deviceFingerPrint
    ) {
        try {
            Device device = new ObjectMapper().readValue(deviceInfo, Device.class);
            accountService.processNewLoginVerfication(email, device);
            return ResponseEntity.ok(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(true)
                            .message("Login verification sent to your email address")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Failed to send login verification: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResultResponse<JwtResponse>> userLogin(
            @RequestBody LoginRequest loginRequest,
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo,
            @RequestHeader(value = "Device-Finger-Print", required = true) String deviceFingerPrint
    ) throws JsonProcessingException {
        JwtResponse jwtResponse = null;
        try {
            Device device = deviceService.saveDevice(new ObjectMapper().readValue(deviceInfo, Device.class));
            Account account = accountService.findByEmail(loginRequest.getEmail());

            if (loginRequest.getSetUpdate().equals("No")) {

                accountService.assignDeviceToAccount(account, device, false);

                // Không login với việc update mật khẩu.

                Authentication authentication = authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())

                );

                SecurityContextHolder.getContext().setAuthentication(authentication);

                jwtResponse = accountService.login(authentication.getPrincipal(), device);

            } else if (loginRequest.getSetUpdate().equals("Yes")) {

                account.setPassword(loginRequest.getPassword());

                accountService.assignDeviceToAccount(account, device, true);

                jwtResponse = jwtTokenService.createJwtResponse(account);

                AccessToken accessToken = AccessToken.builder()
                        .token(jwtResponse.getAccessToken())
                        .refreshToken(jwtResponse.getRefreshToken())
                        .issuedAt(System.currentTimeMillis())
                        .expiresAt(jwtResponse.getExpires())
                        .secretKey(secretKeyProvider.getNewSecretKey().getEncoded())
                        .account(account)
                        .build();

                // Link the device to the access token.
                accessTokenService.addDeviceToAccessToken(device.getId(), accessTokenService.saveToken(accessToken).getId());

            }

            return ResponseEntity.ok(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(jwtResponse)
                            .message("Authentication successfully")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Login failed" + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ResultResponse<JwtResponse>> accountRegister(
            @RequestBody RegisterRequest registerRequest
    ) {
        try {
            Account newAccount = accountService.registerAccount(registerRequest);

            JwtResponse jwtResponse = jwtTokenService.createJwtResponse(newAccount);

            return ResponseEntity.created(URI.create("")).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(jwtResponse)
                            .message("Register successful")
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error registering: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }


    @PostMapping("/send-email")
    public ResponseEntity<ResultResponse<?>> sendEmailVerification(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        try {
            String token = accountService.processNewEmailVerification(emailVerificationRequest.getEmail());
            return ResponseEntity.ok(
                    ResultResponse.<String>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(token)
                            .message("Verification email has been sent.")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<Void>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error sending verification email: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }


    @PostMapping("/assign-device-to-account")
    public ResponseEntity<ResultResponse<?>> assignDeviceToAccount(
            @RequestHeader(value = "Device-Info", required = true) String deviceInfo,
            @RequestHeader(value = "Account-Email", required = true) String email) {
        try {
            //Chuyển đổi chuỗi JSON thành đối tượng Device
            Device deviceSaved = deviceService.saveDevice(new ObjectMapper().readValue(deviceInfo, Device.class));

            Account account = accountService.findByEmail(email);

            accountService.assignDeviceToAccount(account, deviceSaved, true);
            System.out.print("Tới assign device vào account rồi nè");
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(true)
                            .message("Account device info updated successfully")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Invalid Device-Info format: " + e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Error updating account device info: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/device-hide-account")
    public ResponseEntity<ResultResponse<Boolean>> hidePreviousAccount(
            @RequestHeader(value = "Email", required = true) String email,
            @RequestHeader(value = "Device-Finger-Print", required = true) String deviceFingerPrint
    ) {
        try {
            accountService.hidePreviousAccount(email, deviceFingerPrint);
            return ResponseEntity.ok(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(true)
                            .message("Account successfully unlinked from the device")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Error: " + ex.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Error updating account device info: " + ex.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }


    @PostMapping("/waiting-for-email-response")
    public ResponseEntity<ResultResponse<Boolean>> waitingForEmailResponse(@RequestBody WaitingForEmailVerifyRequest emailVerifyRequest) {
        try {
            boolean isValid = accountService.waitingForEmailResponse(emailVerifyRequest);
            return ResponseEntity.ok(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(isValid)
                            .message(isValid ? "Verification is valid" : "Verification is not valid")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<Boolean>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(false)
                            .message("Error checking email verification: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/verify-email")
    public ModelAndView verifyEmail(@RequestParam("token") String token) {
        ModelAndView modelAndView = new ModelAndView();
        EmailVerficationResponse response = accountService.verifyToken(token);

        modelAndView.addObject("email", response.getEmail());

        switch (response.getType()) {
            case "Valid":
                modelAndView.addObject("message", "Xác thực cho email " + response.getEmail() + " thành công");
                modelAndView.setViewName("VerifySuccess");
                break;
            case "Not Found":
                modelAndView.addObject("error", response.getMessage());
                modelAndView.addObject("message", "Token xác nhận không tìm thấy");
                modelAndView.setViewName("VerifyError");
                break;
            case "Expired":
                modelAndView.addObject("error", response.getMessage());
                modelAndView.addObject("message", "Phiên xác nhận quá hạng");
                modelAndView.setViewName("VerifyError");
                break;
            default:
                modelAndView.addObject("error", response.getMessage());
                modelAndView.addObject("message", "Xác thực email không thành công");
                modelAndView.setViewName("VerifyError");
                break;
        }

        return modelAndView;
    }

    @PostMapping("/device-previous-login")
    public ResponseEntity<ResultResponse<List<Account>>> devicePreviousLogin(
            @RequestHeader(value = "Device-Finger-Print") String deviceFingerPrint
    ) {
        try {
            if (deviceFingerPrint == null) {
                return ResponseEntity.created(URI.create("")).body(
                        ResultResponse.<List<Account>>builder()
                                .timeStamp(LocalDateTime.now().toString())
                                .body(null)
                                .message("No accounts found for this device")
                                .status(HttpStatus.NOT_FOUND)
                                .statusCode(HttpStatus.CREATED.value())
                                .build()
                );
            }

            List<Account> accountList = accountService.getAllAccountByDeviceFingerPrint(deviceFingerPrint);

            if (accountList.isEmpty()) {
                return ResponseEntity.created(URI.create("")).body(
                        ResultResponse.<List<Account>>builder()
                                .timeStamp(LocalDateTime.now().toString())
                                .body(accountList)
                                .message("No accounts found for this device")
                                .status(HttpStatus.CREATED)
                                .statusCode(HttpStatus.CREATED.value())
                                .build()
                );
            } else {
                return ResponseEntity.created(URI.create("")).body(
                        ResultResponse.<List<Account>>builder()
                                .timeStamp(LocalDateTime.now().toString())
                                .body(accountList)
                                .message("Accounts found")
                                .status(HttpStatus.CREATED)
                                .statusCode(HttpStatus.CREATED.value())
                                .build()
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<List<Account>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(Collections.emptyList())  // Trả về danh sách rỗng trong trường hợp lỗi.
                            .message("Error occurred " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/merge-google-account")
    public ResponseEntity<ResultResponse<JwtResponse>> mergeGoogleAccountToLocal(@RequestBody MergeAccountGoogleRequest mergeAccountGoogleRequest) {
        try {
            Account account = accountService.mergeAccountFromGoogleToLocalAccount(mergeAccountGoogleRequest);
            JwtResponse jwtResponse = jwtTokenService.createJwtResponse(account);
            AccessToken accessToken = AccessToken.builder()
                    .token(jwtResponse.getAccessToken())
                    .refreshToken(jwtResponse.getRefreshToken())
                    .issuedAt(System.currentTimeMillis())
                    .expiresAt(jwtResponse.getExpires())
                    .secretKey(secretKeyProvider.getNewSecretKey().getEncoded())
                    .build();
            accessTokenService.saveToken(accessToken);
            return ResponseEntity.created(URI.create("")).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(jwtResponse)
                            .message("Register successful")
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<JwtResponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Error logging in: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}
