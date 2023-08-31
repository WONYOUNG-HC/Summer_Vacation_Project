package vacationproject.lobster.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class TokenDataResponse {
    private String token;
    private String userId;
    private String userName;
    private String issued_time;
    private String expired_time;
    private Boolean isProfileNull; // boolean 변수 추가

    // 생성자, getter, setter 등 추가
    public TokenDataResponse(String token, String userId, String userName, String issued_time, String expired_time, boolean isProfileNull) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.issued_time = issued_time;
        this.expired_time = expired_time;
        this.isProfileNull = isProfileNull; // boolean 값 설정
    }
    // getter, setter 등 추가

    // 기본 생성자 추가
    public TokenDataResponse() {
    }
}
