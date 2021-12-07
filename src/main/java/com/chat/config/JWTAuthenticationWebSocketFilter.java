package com.chat.config;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JWTAuthenticationWebSocketFilter extends OncePerRequestFilter {

    private UserDetailsService userDetailsService;
    private JWTHelper jwtHelper;

    public JWTAuthenticationWebSocketFilter(UserDetailsService userDetailsService, JWTHelper jwtHelper) {
        this.userDetailsService = userDetailsService;
        this.jwtHelper = jwtHelper;

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // get token
        String token = jwtHelper.getTokenWebSocket(request);
        // apply filter
        jwtHelper.filter(request, token, userDetailsService);
        filterChain.doFilter(request, response);
    }
}
