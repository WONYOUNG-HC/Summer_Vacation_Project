package vacationproject.lobster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import vacationproject.lobster.domain.User;

@AllArgsConstructor
@Getter
public class AddUserRequest {

    private String userName;
    private String email;
    private String password;
    private String phoneNum;
    private boolean is_login;
    private String profile_img;

    public User toEntity() {
        return User.builder()
                .userName(userName)
                .email(email)
                .password(password)
                .phoneNum(phoneNum)
                .build();
    }
}
