package com.chat.controllers;

import com.chat.domain.User;
import com.chat.repositories.RoomRepository;
import com.chat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/")
@CrossOrigin
public class TestController {

    @Autowired
    private UserDetailsService userDetailsService;

    private UserRepository userRepository;
    private RoomRepository roomRepository;

    @Autowired
    public TestController (UserRepository userRepository, RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @RequestMapping("/dashboard")
    public String firstPage() {
        return "success";
    }


    @GetMapping("/all_rooms")
    public ResponseEntity<?> mainPage() {
        // return all the chatrooms
        return ResponseEntity.ok(roomRepository.findAll());
    }

//    @GetMapping("/startGame/{testId}")
//    public ResponseEntity<?> startGame(Principal principalUser, @PathVariable String testId) {
//        User user = (User) userDetailsService.loadUserByUsername(principalUser.getName());
//        // TODO: send the first question etc?
//        template.convertAndSend("/topic/message/{"+testId+"}", user);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }


    @Autowired
    SimpMessagingTemplate template;

    @PostMapping("/enterGame")
    public ResponseEntity<Void> sendMessage(Principal principalUser,@RequestParam String id) {
        User user = (User) userDetailsService.loadUserByUsername(principalUser.getName());
        //template.convertAndSend("/topic/message/{" + id + "}", user.getUsername());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
