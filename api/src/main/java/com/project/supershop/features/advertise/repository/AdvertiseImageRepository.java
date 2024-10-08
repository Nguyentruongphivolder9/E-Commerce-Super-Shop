package com.project.supershop.features.advertise.repository;

import com.project.supershop.features.advertise.domain.entities.AdvertiseImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface  AdvertiseImageRepository extends JpaRepository<AdvertiseImage, UUID> {
}
