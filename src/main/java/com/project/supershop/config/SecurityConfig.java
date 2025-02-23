package com.project.supershop.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.supershop.features.account.services.impl.AccountServiceImpl;
import com.project.supershop.features.auth.filter.JwtAuthorizationFilter;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private WebClient userClientInfo;
    private final AccessTokenService accessTokenService;
    private final AccountServiceImpl accountService;
    private final JwtTokenService jwtTokenService;
    private final SecretKeyProvider secretKeyProvider;

    public SecurityConfig(@Qualifier("googleIntrospector") OpaqueTokenIntrospector googleIntrospector,
                          @Qualifier("facebookIntrospector") OpaqueTokenIntrospector facebookIntrospector,
                          AccountServiceImpl accountService,
                          SecretKeyProvider secretKeyProvider,
                          JwtTokenService jwtTokenService,
                          WebClient userClientInfo,
                          AccessTokenService accessTokenService) {
        this.accountService = accountService;
        this.jwtTokenService = jwtTokenService;
        this.userClientInfo = userClientInfo;
        this.secretKeyProvider = secretKeyProvider;
        this.accessTokenService = accessTokenService;
    }

    @Autowired
    public void setWebClient(WebClient userClientInfo) {
        this.userClientInfo = userClientInfo;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, NoOpPasswordEncoder noOpPasswordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(accountService).passwordEncoder(noOpPasswordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthorizationFilter jwtAuthorizationFilter = new JwtAuthorizationFilter(accessTokenService, jwtTokenService, new ObjectMapper(), secretKeyProvider);
        BearerTokenAuthenticationFilter bearerTokenFilter = new BearerTokenAuthenticationFilter(authenticationManager(http, passwordEncoder()));

        http
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/**")).permitAll()
                                .requestMatchers(new AntPathRequestMatcher("/api/v1/avatar/**")).permitAll()
                                .requestMatchers(new AntPathRequestMatcher("/api/v1/oauth/**")).permitAll()
                                .requestMatchers(new AntPathRequestMatcher("/api/v1/chat/**")).permitAll()
                                .requestMatchers(new AntPathRequestMatcher("/api/v1/accountTesting/**")).permitAll()
                                .requestMatchers(new AntPathRequestMatcher("/ws-endpoint/**")).permitAll()
                                .anyRequest().authenticated()
                );
//                .oauth2ResourceServer(c -> c.opaqueToken(Customizer.withDefaults()));

        return http.build();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public NoOpPasswordEncoder passwordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }

}
