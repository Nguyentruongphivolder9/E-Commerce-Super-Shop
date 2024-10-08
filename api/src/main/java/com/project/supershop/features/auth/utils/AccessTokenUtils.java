package com.project.supershop.features.auth.utils;

import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.services.AccessTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AccessTokenUtils {
    private AccessTokenService accessTokenService;
    private DeviceRepository deviceRepository;
    @Autowired
    public AccessTokenUtils(AccessTokenService accessTokenService, DeviceRepository deviceRepository) {
        this.accessTokenService = accessTokenService;
        this.deviceRepository = deviceRepository;
    }



    public void handleSingleAccessToken(Set<AccessToken> accessTokenSet, Device deviceFromLogin) {
        AccessToken singleAccessToken = accessTokenSet.stream().findFirst().orElseThrow();

        singleAccessToken.getDevices().forEach(device -> {
            if(device == deviceFromLogin){
                device.removeAccessToken(singleAccessToken);
                deviceRepository.save(device);
            }
        });

        if(singleAccessToken.getDevices().size() == 1){
            singleAccessToken.setAccount(null);
            accessTokenService.deleteAccessToken(singleAccessToken.getId());
        }else{
            accessTokenService.saveToken(singleAccessToken);
        }

    }

    public void handleMultipleAccessTokens(AccessToken currentAccessToken, Set<AccessToken> accessTokenSet, Device deviceFromLogin) {
        AccessToken accessToken = accessTokenSet.stream().findFirst().orElseThrow();

        while (accessToken != null) {
            if (accessToken.equals(currentAccessToken)) {
                if (currentAccessToken.getNewAccessToken() != null) {
                    accessToken.setNewAccessToken(currentAccessToken.getNewAccessToken());
                } else {
                    accessToken.setNewAccessToken(null);
                }
            }

            AccessToken finalAccessToken = accessToken;
            accessToken.getDevices().forEach(device -> {
                if(device == deviceFromLogin){
                    device.setAccessToken(null);
                    deviceRepository.save(device);
                }
            });
            accessToken.setAccount(null);

            accessTokenService.deleteAccessToken(accessToken.getId());

            accessToken = accessTokenService.findById(accessToken.getNewAccessToken());
        }
    }
}
