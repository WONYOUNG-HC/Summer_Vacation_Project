package vacationproject.lobster.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtProvider {

//    @Value("${jwt.password}")
//    private String secretKey;

    SecretKey key = Keys
            .secretKeyFor(SignatureAlgorithm.HS256);

    //==토큰 생성 메소드==//
    public String createToToken(String userId, String userName, Long uId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + Duration.ofDays(1).toMillis()); // 만료기간 1일

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE) // (1)
//                .setIssuer(userId) // 토큰발급자(iss)
                .setIssuedAt(now) // 발급시간(iat)
                .setExpiration(expiration) // 만료시간(exp)
                .claim("userId", userId) // 유저 아이디 정보를 클레임에 저장
                .claim("userName", userName) // 유저 이름 정보를 클레임에 저장
                .claim("uId", uId) // 유저의 table 아이디 클레임에 저장
                .signWith(key, SignatureAlgorithm.HS256) // 알고리즘, 시크릿 키
                .compact();
    }

    //==Jwt 토큰의 유효성 체크 메소드==//
    public Claims parseJwtToken(String token) {
        token = BearerRemove(token); // Bearer 제거
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //==토큰 앞 부분('Bearer') 제거 메소드==//
    public String BearerRemove(String token) {
        if (token.startsWith("Bearer ")) {
            return token.substring("Bearer ".length());
        }
        return token;
    }

    //==토큰으로부터 유저 아이디 추출 메소드==//
    public Long extractUIdFromToken(String token) {
        Claims claims = parseJwtToken(token);
        return claims.get("uId", Long.class);
    }
}