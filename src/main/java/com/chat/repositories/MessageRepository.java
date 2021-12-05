package com.chat.repositories;

import com.chat.domain.ChatMessage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends CrudRepository<ChatMessage, Long> {
}
