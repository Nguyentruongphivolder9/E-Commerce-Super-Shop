package com.project.supershop.features.account.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "qrLogins")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class QrLogin extends BaseEntity {
    private UUID accountIdl;
    private String token;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        this.setUpdatedAt(now);
    }

}
