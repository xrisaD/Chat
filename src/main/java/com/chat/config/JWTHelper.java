package com.chat.config;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTHelper {


    @Value("${jwt.auth.app}")
    private String appName;

    @Value("${jwt.auth.secret_key}")
    private String secretKey;

    @Value("${jwt.auth.expires_in}")
    private int expiresIn;

    private SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256;


    /**
     * Returns all claims given the token
     * @param token authentication token
     * @return claims
     */
    private Claims getAllClaimsFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            claims = null;
        }
        return claims;
    }

    /**
     * Returns the username given a token
     * @param token authentication token
     * @return username
     */
    public String getUsernameFromToken(String token) {
        String username;
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            username = claims.getSubject();
        } catch (Exception e) {
            username = null;
        }
        return username;
    }

    /**
     * Generates and returns a token for a specific user given the username
     * @param username username
     * @return token for this user
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     */
    public String generateToken(String username) throws InvalidKeySpecException, NoSuchAlgorithmException {

        return Jwts.builder()
                .setIssuer(appName)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(generateExpirationDate())
                .signWith( SIGNATURE_ALGORITHM, secretKey )
                .compact();
    }

    private Date generateExpirationDate() {
        return new Date(new Date().getTime() + expiresIn * 1000L);
    }

    /**
     * Given a token and user's data, it validates the token
     * @param token authentication token
     * @param userDetails user details
     * @return if the token is validated or not
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        // get username from token
        final String username = getUsernameFromToken(token);
        return (
                username != null &&
                        username.equals(userDetails.getUsername()) &&
                        !isTokenExpired(token)
        );
    }

    /**
     * Returns if the given token has expired or not
     * @param token authentication token
     * @return true if the token has expired, else false
     */
    public boolean isTokenExpired(String token) {
        Date expireDate = getExpirationDate(token);
        return expireDate.before(new Date());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Returns the expiration date of the given token
     * @param token authentication token
     * @return the token's date of expiration
     */
    private Date getExpirationDate(String token) {
        Date expireDate;
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            expireDate = claims.getExpiration();
        } catch (Exception e) {
            expireDate = null;
        }
        return expireDate;
    }

    public Date getIssuedAtDateFromToken(String token) {
        Date issueAt;
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            issueAt = claims.getIssuedAt();
        } catch (Exception e) {
            issueAt = null;
        }
        return issueAt;
    }

    /**
     * Given a request, it returns the token which is placed at the authentication field
     * @param request a http request from client
     * @return request's token
     */
    public String getToken(HttpServletRequest request) {

        String authHeader = getAuthHeaderFromHeader(request);
        if ( authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    /**
     * The Filter
     * @param request the HTTP request
     * @param token the authentication token
     * @param userDetailsService the user service
     */
    public void filter(HttpServletRequest request, String token, UserDetailsService userDetailsService) {
        // token is not null
        if (token != null) {
            // get username from token
            String userName = getUsernameFromToken(token);
            // if the username is not null
            if(userName != null) {
                // get user's details given the username
                UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                // validate token
                if(validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
    }
    public String getTokenWebSocket(HttpServletRequest request) {
        return request.getParameter("access_token");
    }
    public String getAuthHeaderFromHeader(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }
}

