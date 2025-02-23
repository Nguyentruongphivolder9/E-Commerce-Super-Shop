package com.project.supershop.config;

import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.utils.AccessTokenUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public AccessTokenUtils accessTokenUtils(AccessTokenService accessTokenService, DeviceRepository deviceRepository) {
        return new AccessTokenUtils(accessTokenService, deviceRepository);
    }
}
