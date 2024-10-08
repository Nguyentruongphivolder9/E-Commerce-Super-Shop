package com.project.supershop.features.auth.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "accessTokens")
@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
public class AccessToken extends BaseEntity {
    @Column(length = 1000)
    private String token;
    private String refreshToken;
    private long expiresIn;
    private long issuedAt;
    private long expiresAt;
    private UUID newAccessToken = null;
    @Column(length = 1000)
    private byte[] secretKey;

    @OneToMany(mappedBy = "accessToken", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    Set<Device> devices;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnore
    private Account account;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        this.setUpdatedAt(now);
    }

    public void addDevice(Device device) {
        if (this.devices == null) {
            this.devices = new HashSet<>();
            this.devices.add(device);
        } else if (device != null && !this.devices.contains(device)) {
            this.devices.add(device);
        }
    }

    public void removeDevice(Device device) {
        this.devices.remove(device);
    }


}
