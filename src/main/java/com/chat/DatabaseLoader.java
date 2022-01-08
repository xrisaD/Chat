package com.chat;

import com.chat.domain.Message;
import com.chat.domain.MessageType;
import com.chat.domain.Room;
import com.chat.domain.User;
import com.chat.repositories.MessageRepository;
import com.chat.repositories.RoomRepository;
import com.chat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Calendar;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public DatabaseLoader(UserRepository userRepository, RoomRepository roomRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        // users
        User user1 = new User("chrysa", "123");
        userRepository.save(user1);

        User user2 = new User("nick", "123");
        userRepository.save(user2);

        // rooms
        Room room1 = new Room("Flowers chat");
        roomRepository.save(room1);

        Room room2 = new Room("Cars chat");
        roomRepository.save(room2);

        LocalDateTime date = LocalDateTime.now();

        for (int i=0; i<12; i++){
            messageRepository.save(new Message(room1, user1, "Hello from the past " + i,  date.minusDays(i), null));
        }
        SecurityContextHolder.clearContext();
    }
}
