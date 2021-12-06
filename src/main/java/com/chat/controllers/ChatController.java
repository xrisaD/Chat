package com.chat.controllers;

import com.chat.domain.ChatMessage;
import com.chat.domain.MessageType;
import com.chat.domain.Room;
import com.chat.domain.User;
import com.chat.repositories.MessageRepository;
import com.chat.repositories.RoomRepository;
import com.chat.repositories.UserRepository;
import com.chat.requests.MessageRequest;
import com.chat.responses.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;


@RestController
@RequestMapping("/")
public class ChatController {

    @Autowired
    private UserDetailsService userDetailsService;

    private UserRepository userRepository;
    private RoomRepository roomRepository;
    private MessageRepository messageRepository;

    @Autowired
    public ChatController(UserRepository userRepository, RoomRepository roomRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping("/all_rooms")
    public ResponseEntity<?> mainPage() {
        // return all the chatrooms
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    @CrossOrigin
    public MessageResponse send(MessageRequest message) throws Exception {
        System.out.println("message");
        System.out.println(message);
        User user = userRepository.findById(1L).get();
        // get time
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        // get room
        Optional<Room> roomOptional = roomRepository.findById(1L);

        ChatMessage chatMessage = new ChatMessage(roomOptional.get(), user, message.getContent(), time, MessageType.CHAT);
        messageRepository.save(chatMessage);

        return new MessageResponse(user.getUsername(), message.getContent(), time);
    }

//    @Autowired
//    SimpMessagingTemplate template;

//    @PostMapping("/send")
//    public ResponseEntity<Void> sendMessage(@RequestBody Message textMessageDTO) {
//        System.out.println("ONE  "+textMessageDTO);
//        template.convertAndSend("/topic/messages", textMessageDTO);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @MessageMapping("/sendMessage")
//    public void receiveMessage(@Payload Message textMessageDTO) {
//        // receive message from client
//        System.out.println("TWO  "+textMessageDTO);
//        System.out.println(textMessageDTO);
//    }
//
//    @SendTo("/topic/messages")
//    public Message broadcastMessage(@Payload Message textMessageDTO) {
//        System.out.println("3  "+textMessageDTO);
//        return textMessageDTO;
//    }

}
