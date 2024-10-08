package com.project.supershop.features.auth.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.OAuth2Utils;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.config.FacebookOpaqueTokenIntrospector;
import com.project.supershop.config.GoogleOpaqueTokenIntrospector;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.dto.response.UrlDto;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.auth.utils.OAuthSocialUtils;
import facebook4j.Facebook;
import facebook4j.FacebookException;
import facebook4j.FacebookFactory;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/oauth")
public class OAuth2UserController {

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookAppId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String faceBookAppSecretKey;
    private static final String REDIRECT_URI_GOOGLE = "http://localhost:8080/api/v1/oauth/oauth-2-user/google/callback";
    private static final String REDIRECT_URI_FACEBOOK = "http://localhost:8080/api/v1/oauth/oauth-2-user/facebook/callback";
    private final GoogleOpaqueTokenIntrospector googleOpaqueTokenIntrospector;
    private final FacebookOpaqueTokenIntrospector facebookOpaqueTokenIntrospector;
    private final AccountService accountService;
    private final JwtTokenService jwtTokenService;
    private final AccessTokenService accessTokenService;
    private final OAuthSocialUtils oAuthUtils;

    public OAuth2UserController(OAuthSocialUtils oAuthUtils,FacebookOpaqueTokenIntrospector facebookOpaqueTokenIntrospector, GoogleOpaqueTokenIntrospector googleOpaqueTokenIntrospector, AccountService accountService, JwtTokenService jwtTokenService, AccessTokenService accessTokenService) {
        this.googleOpaqueTokenIntrospector = googleOpaqueTokenIntrospector;
        this.accountService = accountService;
        this.jwtTokenService = jwtTokenService;
        this.accessTokenService = accessTokenService;
        this.oAuthUtils = oAuthUtils;
        this.facebookOpaqueTokenIntrospector = facebookOpaqueTokenIntrospector;
    }

    //Xác thực và uỷ quyền cuar ggle.

    @GetMapping("/oauth-2-user/google/url")
    public ResponseEntity<ResultResponse<UrlDto>> generateAuthUrl() {
        String url = new GoogleAuthorizationCodeRequestUrl(
                googleClientId,
                REDIRECT_URI_GOOGLE,
                Arrays.asList("email", "profile", "openid")
        ).setAccessType("offline").build();

        return ResponseEntity.ok(
                ResultResponse.<UrlDto>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(new UrlDto(url))
                        .message("Authorization URL generated successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/oauth-2-user/google/callback")
    public ResponseEntity<ResultResponse<JwtResponse>> handleCallback(@RequestParam("code") String code) {
        try {
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(),
                    new GsonFactory(),
                    googleClientId,
                    googleClientSecret,
                    code,
                    REDIRECT_URI_GOOGLE
            ).execute();

            OAuth2AuthenticatedPrincipal principal = googleOpaqueTokenIntrospector.introspect(tokenResponse.getAccessToken());
            Account accountFromGoogle = oAuthUtils.createAccountFromPrincipal(principal);
            Account checkForLocalAccount = accountService.checkLocalAccount(accountFromGoogle.getEmail());
            accountFromGoogle.setIsActive(false);

            if (checkForLocalAccount != null) {
                checkForLocalAccount.setIsActive(false);
                //Nếu có tồn tại account trước đó và là local sẽ hỏi user có merge account không.
                JwtResponse jwtResponse1 = jwtTokenService.createJwtResponse(checkForLocalAccount);

                if (!checkForLocalAccount.getIsMerege()) {
                    String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                            .queryParam("code1", jwtResponse1.getAccessToken())
                            .build().toUriString();
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(URI.create(redirectUrl))
                            .build();
                }
                JwtResponse jwtResponse2 = jwtTokenService.createJwtResponse(accountFromGoogle);
                String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                        .queryParam("code1", jwtResponse1.getAccessToken())
                        .queryParam("code2", jwtResponse2.getAccessToken())
                        .build().toUriString();
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(redirectUrl))
                        .build();
            }
            //Nếu không tồn tại thì tạo mới tài khoản và cho nó provider = Google
            Account newAccount = accountService.createAccountFromGoogleAccount(accountFromGoogle);
            newAccount.setIsActive(true);
            JwtResponse jwtResponse = jwtTokenService.createJwtResponse(newAccount);
            boolean hasPassword = newAccount.getPassword() != null && !newAccount.getPassword().isEmpty();
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                    .queryParam("token", jwtResponse.getAccessToken())
                    .queryParam("refreshToken", jwtResponse.getRefreshToken())
                    .queryParam("hasPassword", hasPassword)
                    .build().toUriString();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(redirectUrl))
                    .build();

        } catch (IOException e) {
            return oAuthUtils.handleErrorResponse(e);
        }
    }


    //Xác thực và uỷ quyền của facebook.

    @GetMapping("/oauth-2-user/facebook/url")
    public ResponseEntity<ResultResponse<UrlDto>> generateFacebookAuthUrl() {
        Facebook faceBook = new FacebookFactory().getInstance();
        faceBook.setOAuthAppId(facebookAppId, faceBookAppSecretKey);
        String facebookAuthUrl = faceBook.getOAuthAuthorizationURL(REDIRECT_URI_FACEBOOK);
        return ResponseEntity.ok(
                ResultResponse.<UrlDto>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(new UrlDto(facebookAuthUrl))
                        .message("FaceBook authorization URL generated successfully.")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/oauth-2-user/facebook/callback")
    public ResponseEntity<ResultResponse<JwtResponse>> handleFacebookCallback(@RequestParam("code") String code) throws FacebookException {
        Facebook facebook = new FacebookFactory().getInstance();
        facebook.setOAuthAppId(facebookAppId, faceBookAppSecretKey);
        facebook.getOAuthAccessToken(code, REDIRECT_URI_FACEBOOK);
        try {
            // Lấy thông tin từ Facebook và tạo đối tượng Account
            String facebookAccessToken = facebook.getOAuthAccessToken().getToken();

            OAuth2AuthenticatedPrincipal facebookUserinfo = facebookOpaqueTokenIntrospector.introspect(facebookAccessToken);
            Account accountFromFacebook = oAuthUtils.createAccountFromFacebook(facebookUserinfo);
            System.out.print("Facebook get account: " + facebook.getAccounts());

            Account checkForLocalAccount = accountService.checkLocalAccount(accountFromFacebook.getEmail());
            accountFromFacebook.setIsActive(false);

            if (checkForLocalAccount != null) {
                // Merge account logic similar to Google login
                JwtResponse jwtResponse = jwtTokenService.createJwtResponse(checkForLocalAccount);
                String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                        .queryParam("token", jwtResponse.getAccessToken())
                        .build().toUriString();

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(redirectUrl))
                        .build();
            }

            // Nếu không tồn tại thì tạo mới tài khoản từ thông tin Facebook
            Account newAccount = accountService.createAccountFromFaceBookAccount(accountFromFacebook);
            JwtResponse jwtResponse = jwtTokenService.createJwtResponse(newAccount);
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                    .queryParam("token", jwtResponse.getAccessToken())
                    .queryParam("refreshToken", jwtResponse.getRefreshToken())
                    .build().toUriString();

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(redirectUrl))
                    .build();

        } catch (FacebookException e) {
            return oAuthUtils.handleErrorResponse(e);
        }

    }
}
