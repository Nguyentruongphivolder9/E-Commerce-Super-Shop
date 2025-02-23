package com.project.supershop.features.chat.repositories;

import com.project.supershop.features.chat.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query(value = "SELECT * FROM messages m " +
            "WHERE m.conversation_id = :conversationId " +
            "ORDER BY m.created_at ASC", nativeQuery = true)
    List<Message> findMessageByConversationIdOrderByCreatedAtAsc(
            @Param( "conversationId" ) UUID conversationId);

    //find message by message id
    @Query(value = "SELECT * FROM messages m " +
            "WHERE m.message_id = :messageId", nativeQuery = true)
    Optional<Message> findByMessageId(@Param( "messageId" ) UUID messageId );

}