package com.project.supershop.features.social.repositories;

import com.project.supershop.features.social.models.SavePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavePostRepository extends JpaRepository<SavePost, UUID> {

    List<SavePost> findByAccount_IdOrderByCreatedAtDesc (UUID id);

    boolean existsByAccount_IdAndPost_Id (UUID id, UUID id1);

    SavePost findByAccount_IdAndPost_Id (UUID id, UUID id1);

}