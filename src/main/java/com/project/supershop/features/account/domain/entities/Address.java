package com.project.supershop.features.account.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "addresses")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder

public class Address extends BaseEntity {
    private String addressType;
    private String location;
    private String fullName;
    private String phoneNumber;
    private boolean isDefault;
    private boolean pickupLocation;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
            name = "account_addresses",
            joinColumns = @JoinColumn(name = "address_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    @JsonIgnore
    private Set<Account> accounts = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.setCreatedAt(now);
        this.setUpdatedAt(now);
    }
}
