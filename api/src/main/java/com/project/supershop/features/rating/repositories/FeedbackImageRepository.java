package com.project.supershop.features.rating.repositories;

import com.project.supershop.features.rating.domain.entities.FeedbackImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FeedbackImageRepository extends JpaRepository<FeedbackImage, UUID> {
}
