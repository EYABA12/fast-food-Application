package com.rapidoo.rapidoo_backend.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
	private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	private static final long EXPIRATION_MS = 315360000000L;
	    public String generateToken(String email) {
	        return Jwts.builder()
	                .setSubject(email)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
	                .signWith(secretKey)
	                .compact();
	    }

	    public String validateToken(String token) {
	        try {
	            return Jwts.parserBuilder()
	                    .setSigningKey(secretKey)
	                    .build()
	                    .parseClaimsJws(token)
	                    .getBody()
	                    .getSubject();
	        } catch (Exception e) {
	            return null;
	        }
	    }
}
