package com.project.supershop.features.social.repositories;

import com.project.supershop.features.social.models.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    @Query( "select p from Post p order by p.createdAt DESC" )
    Page<Post> findByOrderByCreatedAtDesc (Pageable pageable);

    @Query( "select p from Post p where p.creator.id = ?1 order by p.createdAt DESC" )
    List<Post> findByCreator_IdOrderByCreatedAtDesc (UUID id);

    @Query("select p from Post p LEFT JOIN p.likes l GROUP BY p.id ORDER BY COUNT(l) DESC")
    Page<Post> findPopularPosts(Pageable pageable);

    @Query("select p from Post p LEFT JOIN p.likes l GROUP BY p.id ORDER BY COUNT(l) DESC")
    List<Post> findPopularPostsNoPage();

    @Query( """
            select p from Post p inner join p.savePosts savePosts
            where savePosts.account.id = ?1
            order by p.createdAt DESC""" )
    List<Post> findBySavePosts_Account_IdOrderByCreatedAtDesc (UUID id);

    @Query( "select p from Post p inner join p.likes likes where likes.account.id = ?1 order by p.createdAt DESC" )
    List<Post> findByLikes_Account_IdOrderByCreatedAtDesc (UUID id);

    @Query( """
            select p from Post p
            where p.caption like %?1% or p.location like %?1% or p.tags like %?1% or p.creator.userName like %?1% or p.creator.email like %?1%
            order by p.createdAt DESC""" )
    Page<Post> search (String term, Pageable pageable);
}