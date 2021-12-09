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
import com.chat.services.StorageService;
import com.sun.istack.NotNull;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.constraints.Null;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;


@RestController
@RequestMapping("/")
public class ChatController {

    private UserDetailsService userDetailsService;
    private final StorageService storageService;

    private UserRepository userRepository;
    private RoomRepository roomRepository;
    private MessageRepository messageRepository;

    @Autowired
    public ChatController(UserDetailsService userDetailsService, UserRepository userRepository, RoomRepository roomRepository, MessageRepository messageRepository, StorageService storageService) {
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.storageService = storageService;
    }

    @GetMapping("/all_rooms")
    @CrossOrigin
    public ResponseEntity<?> allRooms() {
        // return all the chatrooms
        return ResponseEntity.ok(roomRepository.findAll());
    }
    @GetMapping("/info")
    @CrossOrigin
    public ResponseEntity<?> info(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        // return username
        return ResponseEntity.ok(user.getUsername());
    }

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @PostMapping("/chat")
    @CrossOrigin
    public void send(@RequestPart("message") MessageRequest message, @RequestPart("file") @Nullable MultipartFile file, Principal principal) throws Exception {
        System.out.println(message);
        System.out.println(file);
        Long roomId = message.getRoomId();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));;

        // get time
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        // get room
        Optional<Room> roomOptional = roomRepository.findById(roomId);

        ChatMessage chatMessage = new ChatMessage(roomOptional.get(), user, message.getContent(), time, MessageType.CHAT);
        messageRepository.save(chatMessage);

        String fileName = null;
        if (file != null) {
            // generate a name for the file
            fileName = RandomStringUtils.randomAlphanumeric(8);
        }
        messagingTemplate.convertAndSend("/topic/"+roomId, new MessageResponse(user.getUsername(), message.getContent(), time, roomId, fileName));

    }

    @PostMapping("/sendFile")
    @CrossOrigin
    public void send(@RequestParam("file") MultipartFile file, Principal principal) throws Exception {
        System.out.println(file);

    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}
