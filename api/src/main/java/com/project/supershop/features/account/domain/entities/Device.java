package com.project.supershop.features.account.domain.entities;

import com.fasterxml.jackson.annotation.*;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.email.domain.entities.DeviceConfirmation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "devices")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Device extends BaseEntity {

    private String city;
    private String country;
    private String deviceFingerPrint;
    private String ipAddress;
    private String latitude;
    private String longitude;
    private String region;
    private String regionName;
    private String browserName;
    private String deviceType;
    @OneToMany(mappedBy = "device", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<AccountDevice> accountDevices = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accessToken_id")
    @JsonIgnore
    private AccessToken accessToken;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DeviceConfirmation> deviceConfirmations;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        this.setUpdatedAt(now);
    }

    public void setAccessToken(AccessToken accessToken, boolean updateAccessToken) {
        this.accessToken = accessToken;

        if (updateAccessToken && accessToken != null) {
            if (!accessToken.getDevices().contains(this)) {
                accessToken.addDevice(this);
            }
        }
    }

    public void addAccessToken(AccessToken accessToken) {
        this.setAccessToken(accessToken, true);
    }

    public void removeAccessToken(AccessToken accessToken) {
        if (this.accessToken != null && this.accessToken.equals(accessToken)) {
            accessToken.removeDevice(this);
            this.setAccessToken(null, false);
        }
    }

}
