package com.chat.controllers;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Optional;

import com.chat.config.JWTHelper;
import com.chat.domain.User;
import com.chat.repositories.UserRepository;
import com.chat.requests.AuthenticationRequest;
import com.chat.responses.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthenticationController {

    private AuthenticationManager authenticationManager;
    private JWTHelper jWTTokenHelper;
    private UserRepository userRepository;

    @Autowired
    public AuthenticationController (UserRepository userRepository, JWTHelper jWTTokenHelper, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jWTTokenHelper = jWTTokenHelper;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    @CrossOrigin
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authenticationRequest) throws InvalidKeySpecException, NoSuchAlgorithmException {
        System.out.println("LOGIN");
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authenticationRequest.getUsername(), authenticationRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();

        String jwtToken = jWTTokenHelper.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse(jwtToken, user.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) throws InvalidKeySpecException, NoSuchAlgorithmException {

        // username must be unique
        Optional<User> x = userRepository.findByUsername(user.getUsername());
        if (x.isPresent()) {
            return new ResponseEntity("The username already exists", HttpStatus.PRECONDITION_FAILED);
        }

        // save user
        userRepository.save(user);
        // generate and return token
        String jwtToken = jWTTokenHelper.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse(jwtToken, user.getId());
        response.setToken(jwtToken);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/authorize")
    @CrossOrigin
    public ResponseEntity<?> authenticate() {
        return ResponseEntity.ok("ok");
    }
}
