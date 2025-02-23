package com.project.supershop.features.auth.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

import java.security.Key;
import java.util.Base64;

public class JwtUtils {
    private final JwtParser jwtParser;
    public JwtUtils(JwtParser jwtParser){
        this.jwtParser = jwtParser;
    }

    public static Claims extractClaims(String jwtToken, String secretKey) {
        try {
            // Giải mã phần payload của JWT token
            String[] parts = jwtToken.split("\\.");
            String encodedPayload = parts[1];
            byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedPayload);
            String decodedPayload = new String(decodedBytes, "UTF-8");

            // Parse và trả về các claims từ payload đã giải mã
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Could not extract claims from JWT token", e);
        }
    }



        public static Key getSecretKeyFromRequest(HttpServletRequest request){
            String secretKeyString = request.getHeader("Secret-Key");
            if (secretKeyString == null) {
                System.out.println("Secret key not found in request");
                throw new RuntimeException("Secret key not found in request");
            }
            System.out.println("Secret key found: " + secretKeyString);
            return Keys.hmacShaKeyFor(secretKeyString.getBytes());
        }


}
