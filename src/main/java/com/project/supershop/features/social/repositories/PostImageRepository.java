package com.project.supershop.features.social.repositories;

import com.project.supershop.features.social.models.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, UUID> {
    @Query( "select p from PostImage p where p.post.id = ?1 order by p.post.createdAt" )
    List<PostImage> findByPost_IdOrderByPost_CreatedAtAsc (UUID id);

    @Query( "select p from PostImage p where p.post.id = ?1" )
    List<PostImage> findByPost_Id (UUID id);

}