package com.project.supershop.features.voucher.utils.jwtUltis;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import org.springframework.stereotype.Service;

@Service
public class JwtAuthUtils {
    public String getAccessToken(String jwtToken) {
        if(jwtToken != null && !jwtToken.isEmpty()) {
            return jwtToken.split("\\s+")[1];
        }
        return "";
    }

//    public String isJwtTokenExists(String jwtToken) {
//
//    }

    public Claims decodeJwt(String jwt, String secretKey){
        try{
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(jwt)
                    .getBody();
        }catch(SignatureException e){
            throw new RuntimeException(e.getMessage());
        }
    }
}
