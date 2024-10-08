package com.project.supershop.features.email.domain.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Device;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "deviceConfirmations")
@Setter
@Getter
@SuperBuilder
public class DeviceConfirmation extends BaseEntity {
    private String token;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiredDay;

    private boolean isVerify;

    public DeviceConfirmation() {
        this.token = UUID.randomUUID().toString();
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        setUpdatedAt(now);
        this.expiredDay = now.plusMinutes(5);
    }
}
