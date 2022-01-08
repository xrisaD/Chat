package com.chat.repositories;

import com.chat.domain.Message;
import com.chat.domain.Room;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
    List<Message> findChatMessageByRoomOrderByDateDesc(Room room);
}
