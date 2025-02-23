package com.project.supershop.features.auth.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.supershop.features.account.domain.dto.response.DeviceResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.AccountDevice;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.AccountDeviceRepository;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.repositories.AccessTokenRepository;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class JwtTokenServiceImpl implements JwtTokenService, AccessTokenService {
    private final long accessTokenValidity = 3 * 24 * 60 * 60 * 1000; // 3 day
    private final long refreshTokenValidity = 7 * 24 * 60 * 60 * 1000; // 7 days

    private final SecretKeyProvider secretKeyProvider;


    private final String DEVICE_INFO_HEADER = "Device_Info";
    private final String TOKEN_HEADER = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";
    private final AccessTokenRepository accessTokenRepository;
    private final AccountDeviceRepository accountDeviceRepository;
    private AccountService accountService;
    private final DeviceRepository deviceRepository;

    public JwtTokenServiceImpl(AccountDeviceRepository accountDeviceRepository, AccessTokenRepository accessTokenRepository, SecretKeyProvider secretKeyProvider, DeviceRepository deviceRepository) {
        this.accessTokenRepository = accessTokenRepository;
        this.accountDeviceRepository = accountDeviceRepository;
        this.secretKeyProvider = secretKeyProvider;
        this.deviceRepository = deviceRepository;
    }

    @Autowired
    public void setAccountService(AccountService accountService) {
        this.accountService = accountService;
    }


    @Override
    public JwtResponse createJwtResponse(Account account) {
        return createJwtToken(account, null);
    }


    @Override
    public Claims resolveClaims(String token, SecretKey secretKey) {
        try {
            return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Invalid JWT token or claims", e);
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(TOKEN_HEADER);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    @Override
    public Device resolveDevice(HttpServletRequest request, String accessToken) throws JsonProcessingException {
        Device device = new ObjectMapper().readValue(request.getHeader(DEVICE_INFO_HEADER), Device.class);

        Optional<AccessToken> accessTokenOptional = accessTokenRepository.findAccessTokenByToken(accessToken);

        Optional<Device> deviceOptional = deviceRepository.findDeviceByDeviceFingerPrint(device.getDeviceFingerPrint());

        AccessToken accessToken1 = accessTokenOptional.orElseThrow(EntityNotFoundException::new);

        return null;
    }

    @Override
    public boolean validateClaims(Claims claims, SecretKey secretKey) throws AuthenticationException {
        try {
            boolean isValid = claims.getExpiration().after(new Date());
            if (!isValid) {
                throw new JwtException("Token is expired");
            }
            return true;
        } catch (Exception e) {
            throw new JwtException("Invalid token claims", e);
        }
    }

    @Override
    public String decodePassword(String encodedPassword) {
        return new String(Base64.getDecoder().decode(encodedPassword));
    }

    @Override
    public Optional<AccessToken> findByToken(String token) {
        return accessTokenRepository.findAccessTokenByToken(token);
    }

    @Override
    public AccessToken findById(UUID accessTokenId) {
        Optional<AccessToken> accessTokenOptional = accessTokenRepository.findById(accessTokenId);
        if (accessTokenOptional.isEmpty()) {
            throw new EntityNotFoundException("AccessToken not found with id: " + accessTokenId);
        }
        return accessTokenOptional.get();
    }

    @Override
    public AccessToken findByRefreshToken(String refreshToken) {
        Optional<AccessToken> accessToken = accessTokenRepository.findAccessTokenByRefreshToken(refreshToken);
        if (accessToken.isEmpty()) {
            throw new RuntimeException("No token found");
        }
        return accessToken.get();
    }

    @Override
    public AccessToken getAccessTokenBySecretKey(byte[] secretKey) {
        try {
            Optional<AccessToken> accessToken = accessTokenRepository.findAccessTokenBySecretKey(secretKey);
            if (accessToken.isEmpty()) {
                throw new RuntimeException("No token found for the secret key");
            }
            return accessToken.get();
        } catch (Exception e) {
            throw new RuntimeException("Error finding accessToken for secretKey :" + secretKey + e.getMessage());
        }
    }

    @Override
    public void deleteByToken(String token) {
        try {
            Optional<AccessToken> accessTokenOptional = accessTokenRepository.findAccessTokenByToken(token);
            if (accessTokenOptional.isPresent()) {
                accessTokenRepository.deleteAccessTokenByToken(token);
            } else {
                throw new RuntimeException("No accessToken found for token: " + token);
            }
        } catch (Exception e) {
            System.out.println("Error deleting accessToken for token: {}" + token + e.getMessage());
            throw new RuntimeException("Error deleting accessToken for token: " + token + e.getMessage());
        }
    }

    @Override
    public AccessToken saveToken(AccessToken accessToken) {
        try {
            return accessTokenRepository.save(accessToken);
        } catch (Exception e) {
            throw new RuntimeException("Error saving accessToken: " + accessToken, e);
        }
    }

    @Override
    public AccessToken saveAccessTokenAndDeviceInfo(UUID accessTokenId, UUID deviceId) {
        AccessToken accessToken = accessTokenRepository.findById(accessTokenId)
                .orElseThrow(() -> new RuntimeException("AccessToken not found for id: " + accessTokenId));

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found for id: " + deviceId));

        accessToken.addDevice(device);

        return accessTokenRepository.save(accessToken);
    }

    @Override
    public AccessToken addDeviceToAccessToken(UUID deviceId, UUID accessTokenId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found with id : " + deviceId));

        AccessToken accessToken = accessTokenRepository.findById(accessTokenId)
                .orElseThrow(() -> new EntityNotFoundException("AccessToken not found with Id : " + accessTokenId));

        if (device.getAccessToken() == null || device.getAccessToken() != accessToken) {
            device.setAccessToken(accessToken);
        }

        deviceRepository.save(device);
        return accessToken;
    }

    @Override
    public AccessToken findAccessTokenByAccountIdAndDeviceId(UUID deviceId, UUID accountId) {
        return accessTokenRepository.findAccessTokenByDeviceIdAndAccountId(deviceId, accountId);
    }

    @Override
    public void deleteAccessTokenAndRelatedData(UUID accessTokenId) {

        // Xoá lết nối devices liên quan
        deviceRepository.unlinkDevicesByAccessTokenId(accessTokenId);

        // Xóa accessToken
        accessTokenRepository.deleteAccessTokenById(accessTokenId);
    }

    @Override
    public void deleteAccessToken(UUID accessTokenId) {
        Optional<AccessToken> accessTokenOptional = accessTokenRepository.findById(accessTokenId);
        if(accessTokenOptional.isPresent()){
            accessTokenRepository.delete(accessTokenOptional.get());
        }else{
            throw new EntityNotFoundException("AccessToken not found with id: " + accessTokenId);
        }
    }

    @Override
    public Set<DeviceResponse> getAllDeviceByAccessToken(String token, UUID accountId) {
        Account accountFromDb = accountService.findAccountById(accountId);
        List<AccountDevice> accountDeviceList = accountDeviceRepository.findAllByAccountOrderByCreatedAtDesc(accountFromDb);

        Set<DeviceResponse> deviceResponseSet = new HashSet<>();

        for (AccountDevice accountDevice : accountDeviceList) {
            Device device = accountDevice.getDevice();
            DeviceResponse newDeviceResponse = new DeviceResponse();
            newDeviceResponse.setId(device.getId());
            newDeviceResponse.setCity(device.getCity());
            newDeviceResponse.setCountry(device.getCountry());
            newDeviceResponse.setDeviceFingerPrint(device.getDeviceFingerPrint());
            newDeviceResponse.setIpAddress(device.getIpAddress());
            newDeviceResponse.setLatitude(device.getLatitude());
            newDeviceResponse.setLongitude(device.getLongitude());
            newDeviceResponse.setRegion(device.getRegion());
            newDeviceResponse.setRegionName(device.getRegionName());
            newDeviceResponse.setBrowserName(device.getBrowserName());
            newDeviceResponse.setPrimary(accountDevice.isPrimary());
            newDeviceResponse.setAssignedTime(accountDevice.getCreatedAt());
//            newDeviceResponse.setDeviceType(device.getDeviceType());
            deviceResponseSet.add(newDeviceResponse);
        }

        return deviceResponseSet;
    }


    @Override
    public JwtResponse createNewAccessTokenForUpdateAccountLogic(Account accountUpdate, Device deviceInfo, String token) {
//        Optional<AccessToken> accessTokenExist = accessTokenRepository.findAccessTokenByToken(token);
//        Optional<Device> deviceOptional = deviceRepository.findDeviceByDeviceId(deviceInfo.getDeviceId());
//        if (accessTokenExist.isEmpty()) {
//            throw new EntityNotFoundException("AccessToken not found");
//        }
//        if (deviceOptional.isEmpty()) {
//            deviceRepository.save(deviceInfo);
//        }
//        AccessToken accessToken = accessTokenExist.get();
//        Set<Device> devices = accessToken.getDevices().stream().map(
//
//        )
//
        return null;
    }

    public final Claims parseJwtClaims(String token) {
        Key secretKey = secretKeyProvider.getSecretKeyByAccessToken(token);
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }

    @Override
    public Account parseJwtTokenToAccount(String token) {
        String accessToken = token.substring(7);
        Claims accountClaims = parseJwtClaims(accessToken);

        Account accountFinding = accountService.findByEmail(accountClaims.getSubject());
        if (accountFinding == null) {
            throw new RuntimeException("Invalid token");
        }
        return accountFinding;
    }


    private JwtResponse createJwtToken(Account account, SecretKey sKey) {
        SecretKey secretKey = (sKey != null) ? sKey : secretKeyProvider.getNewSecretKey();

        Claims claims = Jwts.claims().setSubject(account.getEmail());

        LocalDateTime birthDay = account.getBirthDay();

        String birthDayString = (birthDay == null) ? "" : birthDay.toString();

        claims.put("_id", account.getId());

        claims.put("userName", account.getUserName());

        claims.put("fullName", account.getFullName());

        claims.put("email", account.getEmail());

        claims.put("role", account.getRoleName());

        claims.put("phoneNumber", account.getPhoneNumber());

        claims.put("gender", account.getGender());

        claims.put("avatarUrl", account.getAvatarUrl());

        claims.put("birthDay", birthDayString);

        claims.put("fullNameChanges", account.getUserFullNameChanges());

        claims.put("provider", account.getProvider());

        Date tokenCreateTime = new Date();

        Date tokenValidity = new Date(tokenCreateTime.getTime() + accessTokenValidity);

        String accessTokens = Jwts.builder()
                .setClaims(claims)
                .setExpiration(tokenValidity)
                .signWith(secretKey)
                .compact();


        Date refreshTokenExpiry = new Date(tokenCreateTime.getTime() + refreshTokenValidity);

        String refreshToken = Jwts.builder()
                .setSubject(account.getEmail())
                .setExpiration(refreshTokenExpiry)
                .signWith(secretKey)
                .compact();

        JwtResponse jwtResponse = new JwtResponse();

        jwtResponse.setAccessToken(accessTokens);

        jwtResponse.setRefreshToken(refreshToken);

        jwtResponse.setExpireRefreshToken(refreshTokenExpiry.getTime());

        jwtResponse.setExpires(tokenValidity.getTime());

        jwtResponse.setAccount(account);

        return jwtResponse;
    }
}