package com.chat.requests;

/**
 * Request sent from client to server
 * in order to check if the client is authenticated
 */
public class AuthenticationRequest {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }


}
