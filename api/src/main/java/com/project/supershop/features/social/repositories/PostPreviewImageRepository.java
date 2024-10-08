package com.project.supershop.features.social.repositories;

import com.project.supershop.features.social.models.PostPreviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostPreviewImageRepository extends JpaRepository<PostPreviewImage, UUID> {
}
