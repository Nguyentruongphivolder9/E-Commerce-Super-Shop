package com.project.supershop.features.email.domain.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "confirmations")
@Setter
@Getter
@SuperBuilder
public class Confirmation extends BaseEntity {
    private String token;

    @ManyToOne
    @JoinColumn(name = "email_id")
    private Email email;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiredDay;

    private boolean isVerify;

    public Confirmation() {
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
