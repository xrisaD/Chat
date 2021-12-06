package com.chat;

import com.chat.domain.Room;
import com.chat.domain.User;
import com.chat.repositories.RoomRepository;
import com.chat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public DatabaseLoader(UserRepository userRepository, RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
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

        SecurityContextHolder.clearContext();
    }
}
