package com.project.supershop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class RegistrationWebConfig {

    @Value("${spring.security.oauth2.client.registration.google.introspection-uri}")
    private String introspectionUri; // Used for Google introspector if needed

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    @Primary
    public OpaqueTokenIntrospector googleIntrospector(WebClient.Builder webClientBuilder) {
        return new GoogleOpaqueTokenIntrospector(webClientBuilder);
    }

    @Bean
    @Primary
    public WebClient googleUserInfo(WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl("https://www.googleapis.com").build();
    }

    @Bean
    public OpaqueTokenIntrospector facebookIntrospector(WebClient.Builder webClientBuilder) {
        return new FacebookOpaqueTokenIntrospector(webClientBuilder);
    }

    @Bean
    public WebClient facebookUserInfo(WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl("https://graph.facebook.com").build();
    }
}
