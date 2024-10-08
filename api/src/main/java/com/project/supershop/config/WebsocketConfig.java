package com.project.supershop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import static com.project.supershop.features.chat.constants.WebSocketConstants.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker ( MessageBrokerRegistry config) {
        config.enableSimpleBroker(TOPIC, QUEUE, USER);
        config.setApplicationDestinationPrefixes(SUPERSHOP);
        config.setUserDestinationPrefix(USER);
    }

    @Override
    public void registerStompEndpoints ( StompEndpointRegistry registry) {
        registry.addEndpoint(WS_ENDPOINT)
                .setAllowedOrigins(ORIGIN)
                .setAllowedOriginPatterns(ORIGIN_PATTERNS)
                .withSockJS();
    }
}
