package com.chat.controllers;

import com.chat.domain.*;
import com.chat.repositories.FileRepository;
import com.chat.repositories.MessageRepository;
import com.chat.repositories.RoomRepository;
import com.chat.repositories.UserRepository;
import com.chat.requests.MessageRequest;
import com.chat.responses.MessageResponse;
import com.chat.responses.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@RestController
@RequestMapping("/")
public class ChatController {

    DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH);
    private UserDetailsService userDetailsService;

    private UserRepository userRepository;
    private RoomRepository roomRepository;
    private MessageRepository messageRepository;
    private FileRepository fileRepository;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public ChatController(UserDetailsService userDetailsService, UserRepository userRepository, RoomRepository roomRepository, MessageRepository messageRepository, FileRepository fileRepository) {
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.fileRepository = fileRepository;
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

    @GetMapping("/history/{id}")
    @CrossOrigin
    public ResponseEntity<?> history(@PathVariable("id") Long roomId) {
        // get room if exists
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        List<Message> messages = messageRepository.findChatMessageByRoomOrderByDateDesc(room);

        // get the last 10 messages
        if (messages.size() > 10) {
            messages = messages.subList(0, 10);
        }
        Collections.reverse(messages);
        // create the response of messages
        List<MessageResponse> response = new ArrayList<>();
        for (int i = 0; i < messages.size(); i++) {
            Message m = messages.get(i);
            response.add(new MessageResponse(m.getUser().getUsername(), m.getContent(), format.format(m.getDate()), m.getRoom().getId(), m.getFile()));
        }
        // return history
        return ResponseEntity.ok(response);
    }


    @PostMapping("/chat")
    @CrossOrigin
    public void send(@RequestPart("message") MessageRequest message, @RequestPart("file") @Nullable MultipartFile file, Principal principal) throws Exception {
        Long roomId = message.getRoomId();
        // get user if exists
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        // get room
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        String filename = null;
        File x= null;
        if (file != null) {
            // if file exists, get file
            filename = file.getOriginalFilename();
            x = fileRepository.save(new File(file.getBytes(), filename, file.getContentType()));
        }
        // create date for the message
        LocalDateTime date = LocalDateTime.now();
        Message chatMessage = new Message(room, user, message.getContent(), date, x);
        // save message
        messageRepository.save(chatMessage);
        // send message to all users
        messagingTemplate.convertAndSend("/topic/"+roomId, new MessageResponse(user.getUsername(), message.getContent(), format.format(date), roomId, x));
    }

    @GetMapping("/download/{id}")
    @CrossOrigin
    public Resource downloadFile(@PathVariable("id") Long id) {
        // return the file with the given file id
        byte[] file = fileRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)).getContent();
        return new ByteArrayResource(file);
    }
    @GetMapping("/metadata/{id}")
    @CrossOrigin
    public Metadata downloadMetadata(@PathVariable("id") Long id) {
        // return the metadata given the file id
        File file = fileRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return new Metadata(file.getName(), file.getContentType());
    }
}
