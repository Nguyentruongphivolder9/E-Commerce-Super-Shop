package com.project.supershop.features.rating.repositories;

import com.project.supershop.features.rating.domain.entities.VoteUseFull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoteUseFullRepository extends JpaRepository<VoteUseFull, UUID> {
    @Query(value = "SELECT v FROM VoteUseFull v " +
            "WHERE v.account.id = :accountId AND v.rating.id = :ratingId")
    Optional<VoteUseFull> findByAccountIdAndByRatingId(
            @Param("accountId") UUID accountId,
            @Param("ratingId") UUID ratingId);

    @Query("SELECT COUNT(vu) FROM VoteUseFull vu WHERE vu.rating.id = :ratingId")
    int countVoteByRatingId(@Param("ratingId") UUID ratingId);
}
