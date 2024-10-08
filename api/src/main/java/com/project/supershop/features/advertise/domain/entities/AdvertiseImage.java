package com.project.supershop.features.advertise.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "advertiseImage")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class AdvertiseImage extends BaseEntity {
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "advertiseId")
    private Advertise advertise;

    // Factory method to create an AdvertiseImage object
    public static AdvertiseImage createAdvertiseImage(String fileName, Advertise advertise) {
        return AdvertiseImage.builder()
                .imageUrl(fileName)
                .advertise(advertise)
                .build();
    }
}
