package com.project.supershop.features.account.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "account_devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDevice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "is_primary", nullable = false, columnDefinition = "boolean default false")
    private boolean isPrimary = false;

    @Column(name = "is_hide", nullable = false, columnDefinition = "boolean default false")
    private boolean isHide = false;

    @Column(name = "is_active", nullable = false, columnDefinition = "boolean default false")
    private boolean isActive = false;

    @Column(name = "login_time", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime logInTime = LocalDateTime.now();


    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        this.setUpdatedAt(now);
    }

    @PreUpdate
    protected void onUpdate() {
        LocalDateTime now = LocalDateTime.now();
        this.setUpdatedAt(now);
    }
}
