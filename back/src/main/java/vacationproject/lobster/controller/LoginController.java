package vacationproject.lobster.controller;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vacationproject.lobster.Security.JwtProvider;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.LoginRequest;
import vacationproject.lobster.dto.NewPasswordRequest;
import vacationproject.lobster.dto.TokenDataResponse;
import vacationproject.lobster.repository.UserRepository;
import vacationproject.lobster.service.MailSenderService;
import vacationproject.lobster.service.UserService;

import java.util.Arrays;
import java.util.Base64;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final MailSenderService mailSenderService;
    private final JwtProvider jwtProvider;
    private final TokenDataResponse tokenDataResponse;

    public LoginController(
            UserService userService,
            MailSenderService mailSenderService,
            UserRepository userRepository,
            JwtProvider jwtProvider,
            TokenDataResponse tokenDataResponse) {

        this.userService = userService;
        this.userRepository = userRepository;
        this.mailSenderService = mailSenderService;
        this.jwtProvider = jwtProvider;
        this.tokenDataResponse = tokenDataResponse;
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String userId = request.getUserId();
        String password = request.getPassword();

        if (checkLogin(userId, password)) {
            // 로그인 성공 시, 토큰 생성
            User user = userRepository.findByUserId(userId);
            String token = jwtProvider.createToToken(userId, user.getUserName(), user.getUId());

            // 클라이언트에게 토큰을 반환
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    //==토큰 인증 컨트롤러==// + 프로필 이미지 체크
    @GetMapping(value = "/checkToken")
    public ResponseEntity<TokenDataResponse> checkToken(@RequestHeader(value = "Authorization") String token) {
        try {
            // Bearer 제거
            String parsedToken = token.substring("Bearer ".length());

            System.out.println(parsedToken);

            // 토큰의 유효성 검사 및 Claims 얻어오기
            Claims claims = jwtProvider.parseJwtToken(parsedToken);

            if (claims != null) {
                // 토큰이 유효한 경우 클라이언트에게 토큰 데이터를 응답
                String userId = claims.get("userId", String.class);
                String userName = claims.get("userName", String.class);
                Long uId = claims.get("uId", Long.class);

                boolean isProfileNull = userService.isProfileImageNull(uId);

                TokenDataResponse tokenData = new TokenDataResponse(parsedToken, userId, userName, claims.getIssuedAt().toString(), claims.getExpiration().toString(), isProfileNull);

                return ResponseEntity.ok(tokenData);
            } else {
                // 토큰이 유효하지 않은 경우 클라이언트에게 에러 응답
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            // 토큰 파싱 또는 검증에 문제가 있는 경우 클라이언트에게 에러 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // 프로필 입력하기
    @PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestHeader(value = "Authorization") String token,
            @RequestPart("image") MultipartFile image
    ) {
        try {
            String parsedToken = token.substring("Bearer ".length());

            Long uIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);
            System.out.println("User ID from token: " + uIdFromToken);

            // 이미지가 잘 전달되었는지 확인하기 위해 이미지의 이름과 크기를 출력
            System.out.println("Received image: " + image.getOriginalFilename());
            System.out.println("Image size: " + image.getSize() + " bytes");
            System.out.println(parsedToken);

            System.out.println("전");

//         이미지를 byte 배열로 변환하여 해당 사용자의 profileImage 필드에 저장
            byte[] imageBytes = image.getBytes();

            System.out.println("받긴함");

            // 사용자 정보를 가져와서 profileImage 필드에 이미지 저장
            User user = userRepository.findById(uIdFromToken).orElseThrow(() -> new RuntimeException("User not found"));
            user.setProfileImg(imageBytes);
            userRepository.save(user); // 변경된 사용자 정보 저장

            return ResponseEntity.ok("Image received successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error receiving image");
        }
    }

    // 이미지 불러오기
    @GetMapping("/profile-image")
    public ResponseEntity<byte[]> loadImage(@RequestHeader(value = "Authorization") String token) {
        String parsedToken = token.substring("Bearer ".length());
        Long uIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        byte[] imageBytes = userService.getProfileImageBytes(uIdFromToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG); // 이미지 타입에 맞게 설정4

        System.out.println("잘갔어");

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    // 로그인 계정 확인
    public boolean checkLogin(String userId, String password) {
        User user = userRepository.findByUserId(userId);
        return user != null && user.getPassword().equals(password);
    }

    // 비밀 번호 찾기 + 인증 코드 보내기
    @PostMapping("/passwordFind")
    public ResponseEntity<String> pwFind(@RequestBody LoginRequest request) {
        if(checkIdAndEmail(request.getUserId(), request.getEmail())) {

            // 인증 코드 생성 및 이메일 전송 등 로직 추가
            String thisIsEmail = request.getEmail();
            String verificationCode = userService.generateVerificationCode();
            mailSenderService.run(thisIsEmail, verificationCode);

            return ResponseEntity.ok(verificationCode);
        } else {
            return ResponseEntity.badRequest().body("아이디와 이메일이 일치하지 않습니다.");
        }
    }

    // DB에서 아이디와 이메일 확인
    public boolean checkIdAndEmail(String userId, String email) {
        User user = userRepository.findByUserId(userId);
        return user != null && user.getEmail().equals(email);
    }

    // 새로운 비밀번호 정하기
    @PostMapping("/newPassword")
    public ResponseEntity<String> newPassword(@RequestBody NewPasswordRequest request) {
        String userId = request.getUserId();
        String newPassword = request.getNewPassword();

        User user = userRepository.findByUserId(userId);

        if (user != null) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok("새로운 비밀번호가 설정되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다.");
        }
    }
}