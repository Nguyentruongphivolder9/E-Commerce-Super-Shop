package com.project.supershop.features.social.repositories;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.social.models.AccountPostLike;
import com.project.supershop.features.social.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface AccountPostLikeRepository extends JpaRepository<AccountPostLike, UUID> {
    boolean existsByPost_IdAndAccount_Id(UUID postId, UUID accountId);

    @Query( "select a from AccountPostLike a where a.post.id = ?1" )
    List<AccountPostLike> findByPost_Id (UUID id);



    @Transactional
    @Modifying
    @Query( "delete from AccountPostLike a where a.post = ?1 and a.account = ?2" )
    void deleteByPostAndAccount (Post post, Account account);
}