package com.project.supershop.config;

import com.project.supershop.features.account.domain.entities.GoogleUserInfo;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.Map;

public class GoogleOpaqueTokenIntrospector implements OpaqueTokenIntrospector {
    private final WebClient userInfoClient;

    public GoogleOpaqueTokenIntrospector(WebClient.Builder webClientBuilder) {
        this.userInfoClient = webClientBuilder.baseUrl("https://www.googleapis.com").build();
    }

    @Override
    public OAuth2AuthenticatedPrincipal introspect(String token) {
        try {
            GoogleUserInfo googleUserInfo = userInfoClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/oauth2/v3/userinfo")
                            .queryParam("access_token", token)
                            .build())
                    .retrieve()
                    .bodyToMono(GoogleUserInfo.class)
                    .block();

            if (googleUserInfo == null) {
                throw new GoogleUserInfoRetrievalException("Failed to retrieve user info from Google.");
            }

            Map<String, Object> attributes = new HashMap<>();
            attributes.put("sub", googleUserInfo.sub());
            attributes.put("name", googleUserInfo.name());
            attributes.put("given_name", googleUserInfo.given_name());
            attributes.put("family_name", googleUserInfo.family_name());
            attributes.put("picture", googleUserInfo.picture());
            attributes.put("email", googleUserInfo.email());
            attributes.put("email_verified", googleUserInfo.email_verified());
            attributes.put("locale", googleUserInfo.locale());

            return new OAuth2IntrospectionAuthenticatedPrincipal(googleUserInfo.name(), attributes, null);

        } catch (WebClientResponseException ex) {
            throw new GoogleUserInfoRetrievalException("Error retrieving user info from Google: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            throw new GoogleUserInfoRetrievalException("Unexpected error while retrieving user info from Google: " + ex.getMessage(), ex);
        }
    }

    public static class GoogleUserInfoRetrievalException extends RuntimeException {
        public GoogleUserInfoRetrievalException(String message) {
            super(message);
        }

        public GoogleUserInfoRetrievalException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
