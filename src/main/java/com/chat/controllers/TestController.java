package com.chat.controllers;

import com.chat.domain.User;
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

    private OptionRepository optionRepository;
    private UserRepository userRepository;
    private TestRepository testRepository;

    @Autowired
    public TestController (OptionRepository optionRepository, UserRepository userRepository, TestRepository testRepository) {
        this.optionRepository = optionRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
    }

    @RequestMapping("/dashboard")
    public String firstPage() {
        return "success";
    }


    @GetMapping("/all_tests")
    public ResponseEntity<?> mainPage(Principal principalUser) {
        User user = (User) userDetailsService.loadUserByUsername(principalUser.getName());
        // return all the tests that this user has created
        return ResponseEntity.ok(testRepository.findByUser(user));
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
