package com.project.supershop.features.keywordForbidden.repositories;

import com.project.supershop.features.keywordForbidden.domain.entities.ForbiddenKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ForbiddenKeywordRepository extends JpaRepository<ForbiddenKeyword, UUID> {
    Optional<ForbiddenKeyword> findByKeyword(String title);
}
