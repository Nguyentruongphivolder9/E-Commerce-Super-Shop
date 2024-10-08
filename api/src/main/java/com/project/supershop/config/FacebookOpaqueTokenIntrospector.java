package com.project.supershop.config;

import com.project.supershop.features.account.domain.entities.FaceBookUserInfo;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.Map;

public class FacebookOpaqueTokenIntrospector implements OpaqueTokenIntrospector {
    private final WebClient userInfoClient;

    public FacebookOpaqueTokenIntrospector(WebClient.Builder webClientBuilder) {
        this.userInfoClient = webClientBuilder.baseUrl("https://graph.facebook.com").build();
    }

    @Override
    public OAuth2AuthenticatedPrincipal introspect(String token) {
        try {
            FaceBookUserInfo facebookUserInfo = userInfoClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/me")
                            .queryParam("access_token", token)
                            .queryParam("fields", "id,name,email,gender,birthday,location,hometown,picture")
                            .build())
                    .retrieve()
                    .bodyToMono(FaceBookUserInfo.class)
                    .block();

            System.out.println("Facebook account: " + facebookUserInfo);

//            if (facebookUserInfo == null) {
//                throw new FacebookUserInfoRetrievalException("Failed to retrieve user info from Facebook.");
//            }

//            Map<String, Object> attributes = new HashMap<>();
//            attributes.put("sub", facebookUserInfo.);
//            attributes.put("name", facebookUserInfo.name());
//            attributes.put("given_name", facebookUserInfo.given_name());
//            attributes.put("family_name", facebookUserInfo.family_name());
//            attributes.put("picture", facebookUserInfo.picture());
//            attributes.put("email", facebookUserInfo.email());
//            attributes.put("email_verified", facebookUserInfo.email_verified());
//            attributes.put("locale", facebookUserInfo.locale());


//            return new OAuth2IntrospectionAuthenticatedPrincipal(facebookUserInfo.name(), attributes, null);
                return null;
        } catch (WebClientResponseException ex) {
            throw new FacebookUserInfoRetrievalException("Error retrieving user info from Facebook: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            throw new FacebookUserInfoRetrievalException("Unexpected error while retrieving user info from Facebook: " + ex.getMessage(), ex);
        }
    }

    public static class FacebookUserInfoRetrievalException extends RuntimeException {
        public FacebookUserInfoRetrievalException(String message) {
            super(message);
        }

        public FacebookUserInfoRetrievalException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
