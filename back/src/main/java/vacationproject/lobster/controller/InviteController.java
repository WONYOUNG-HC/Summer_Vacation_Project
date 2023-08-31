package vacationproject.lobster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vacationproject.lobster.Security.JwtProvider;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.Invite;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.TokenDataResponse;
import vacationproject.lobster.dto.invite.AcceptInvitationRequestDTO;
import vacationproject.lobster.dto.invite.CheckResponse;
import vacationproject.lobster.dto.invite.InviteDTO;
import vacationproject.lobster.dto.invite.InviteRequestDTO;
import vacationproject.lobster.repository.GroupRepository;
import vacationproject.lobster.repository.InviteRepository;
import vacationproject.lobster.service.InviteService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class InviteController {

    // 검색해서 유저 찾기 -> creator 일 경우만 사용 가능.
    // 아이디 옆 초대하기 버튼 group_id, user_id로 invite 테이블에 추가
    // i_id는 자동 1증가. status는 디폴트는 process임. sent_at은 보내지는 시간 체크. 3일 후 만료되게 설정.
    // 각 사용자의 초대 목록 띄울때는 user_id에서 한번, status 체크해서 띄우기.

    private final GroupRepository groupRepository;
    private final JwtProvider jwtProvider;
    private final InviteService inviteService;
    private final InviteRepository inviteRepository;


    // 초대 권한이 있는지 체크(화면을 눌렀을 때 초대 모달 띄워짐)
    @GetMapping("/api/checkCreator")
    public ResponseEntity<String> checkCreator(@RequestHeader(name = "Authorization") String token,
                                               @RequestParam Long groupId) {

        String parsedToken = token.substring("Bearer ".length());
        Long userIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        User creator = group.getCreator();

        if (creator.getUId().equals(userIdFromToken)) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("failure");
        }
    }

    // 입력한 로그인 아이디로 invite DB에 넣기
    @PostMapping("/api/invite")
    public ResponseEntity<String> sendInvitation(@RequestHeader(name = "Authorization") String token,
                                                 @RequestBody InviteRequestDTO inviteRequest) {
        inviteRequest.setToken(token);
        inviteService.sendInvitation(inviteRequest);
        return ResponseEntity.ok("Invitation sent successfully.");
    }

    // 초대 카드 조회
    @GetMapping("/api/inviteCard")
    public ResponseEntity<List<InviteDTO>> getPendingInvitationsForUser(@RequestHeader(name = "Authorization") String token) {
        String parsedToken = token.substring("Bearer ".length());
        Long userIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        List<InviteDTO> pendingInvitations = inviteService.getPendingInvitationsForUser(userIdFromToken);

        return ResponseEntity.ok(pendingInvitations);
    }

    // 초대 수락
    @PostMapping("/api/acceptInvitation")
    public ResponseEntity<String> acceptInvitation(
            @RequestHeader(name = "Authorization") String token,
            @RequestBody AcceptInvitationRequestDTO requestDTO) {

        String parsedToken = token.substring("Bearer ".length());
        Long userIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        // 해당 그룹에 멤버 추가 로직 호출
        inviteService.addMemberToGroup(requestDTO.getGroupId(), userIdFromToken);

        // 초대 수락과 상태 업데이트
        inviteService.acceptInvitationAndUpdateStatus(requestDTO.getIid());

        return ResponseEntity.ok("초대를 수락했습니다.");
    }

    // 초대 거절
    @PostMapping("/api/rejectInvitation")
    public ResponseEntity<String> rejectInvitation(
            @RequestHeader(name = "Authorization") String token,
            @RequestBody AcceptInvitationRequestDTO requestDTO) {

        String parsedToken = token.substring("Bearer ".length());
        Long userIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        inviteService.rejectInvitationAndUpdateStatus(requestDTO.getIid());

        return ResponseEntity.ok("초대를 거절했습니다.");
    }

}