package vacationproject.lobster.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.AddUserRequest;
import vacationproject.lobster.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 회원 가입
    public void registerMembership(String name, String userId, String email, String password, String phoneNum) {

        User user = new User();
        user.setUserId(userId); // 변수 이름 변경
        user.setUserName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setPhoneNum(phoneNum); // 변수 이름 수정

        userRepository.save(user);
    }
    // 아이디 중복 체크
    public boolean isUserIdExists(String userId) {
        User user = userRepository.findByUserId(userId); // 변수 이름 변경
        return user != null;
    }

    // 이메일 중복 체크
    public boolean isEmailExists(String email) {
        User user = userRepository.findByEmail(email);
        return user != null;
    }

    // 랜덤 코드 생성
    public String generateVerificationCode() {
        return RandomStringUtils.randomNumeric(6);
    }

    // 프로필 체크
    public boolean isProfileImageNull(Long uId) {
        User user = userRepository.findById(uId).orElse(null);
        return user != null && user.getProfileImg() == null; // 프로필 이미지가 null인지 아닌지 체크
    }

    // 프로픨 유저아이디로 불러오기
    public byte[] getProfileImageBytes(Long uId) {
        return userRepository.findProfileImageByUId(uId);
    }
}