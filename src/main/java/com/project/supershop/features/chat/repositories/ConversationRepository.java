package com.project.supershop.features.chat.repositories;

import com.project.supershop.features.chat.models.Conversation;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query(value = "SELECT * FROM conversations c " +
            "JOIN conversation_accounts ca ON c.id = ca.conversation_id " +
            "WHERE c.id = :conversationId", nativeQuery = true)
    Optional<Conversation> findByConversationId(
            @Param("conversationId") UUID conversationId);

    @NotNull
    Optional<Conversation> findById(@NotNull UUID id);

    //Native query to get conversation by account id
    @Query(value = "SELECT DISTINCT c.* FROM conversations c " +
            "JOIN conversation_accounts ca1 " +
            "ON c.id = ca1.conversation_id " +
            "JOIN conversation_accounts ca2 " +
            "ON c.id = ca2.conversation_id " +
//            "JOIN messages m " +
//            "ON c.id = m.conversation_id " +
            "WHERE ca1.account_id = :currentAccountId AND ca2.account_id = :receiverId",
            nativeQuery = true)
    Optional<Conversation> getConversationByIdAndAccountId(
            @Param("receiverId")UUID receiverId,
            @Param("currentAccountId") UUID accountId );


    @Query(value = "SELECT * FROM conversations c " +
            "JOIN conversation_accounts ca ON c.id = ca.conversation_id " +
            "WHERE ca.account_id = :accountId " +
            "ORDER BY c.created_at DESC",
            nativeQuery = true)
    Page<Conversation> findConversationsByAccountId(
            Pageable pageable,
            @Param("accountId") UUID accountId);
}

