package vacationproject.lobster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vacationproject.lobster.Security.JwtProvider;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.dto.group.*;
import vacationproject.lobster.service.GroupService;

import java.util.List;


@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    private final GroupService groupService;
    private final JwtProvider jwtProvider;

    //Group 생성
    @PostMapping("/api/groups")
    public ResponseEntity<Group> createGroup(@RequestHeader HttpHeaders headers,
                                             @RequestBody AddGroupRequest request) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);

        Group savedGroup = groupService.save(request, uId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedGroup);
    }

    //Group 목록 조회
    @GetMapping("/api/groups")
    public ResponseEntity<List<Group>> findAllGroups(@RequestHeader HttpHeaders headers) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);

        List<Group> groups = groupService.getGroupsByUserId(uId);

        return ResponseEntity.ok()
                .body(groups);
    }

    /*//Group id로 단건 조회
    @GetMapping("/api/groups/{groupId}")
    public ResponseEntity<GroupResponse> findGroupById(@RequestHeader HttpHeaders headers,
                                                       @PathVariable long groupId) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);
        Group group = groupService.findById(groupId);

        return ResponseEntity.ok()
                .body(new GroupResponse(group));
    }*/

    //해당 그룹 그룹원들 반환
    @GetMapping("/api/groups/{groupId}/users")
    public ResponseEntity<List<GroupUsersResponse>> getGroupUsers(@RequestHeader HttpHeaders headers,
                                                            @PathVariable Long groupId) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);

        List<GroupUsersResponse> groupUsersResponse = groupService.getGroupUsers(groupId);
        return ResponseEntity.ok(groupUsersResponse);
    }

    //그룹원 일정 다 모인 캘린더 보기
    @GetMapping("/api/groups/{groupId}")
    public ResponseEntity<CombinedCalenderResponse> getCombinedCalendarForGroup(@RequestHeader HttpHeaders headers,
                                                                                @PathVariable long groupId,
                                                                                @RequestParam int year,
                                                                                @RequestParam int month) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);
        CombinedCalenderResponse combinedCalender = groupService.getCombinedCalenderForGroup(groupId, year, month);

        return ResponseEntity.ok(combinedCalender);
    }

    //Group 삭제
    @DeleteMapping("/api/groups/{groupId}")
    public ResponseEntity<Void> deleteGroup(@RequestHeader HttpHeaders headers,
                                            @PathVariable long groupId) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);
        groupService.delete(groupId);

        return ResponseEntity.ok()
                .build();
    }

    //Group 탈퇴
    @DeleteMapping("/api/groups/{groupId}/leave")
    public ResponseEntity<Void> leaveGroup(@RequestHeader HttpHeaders headers,
                                           @PathVariable long groupId) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);

        groupService.leaveGroup(groupId, uId);
        return ResponseEntity.ok().build();
    }

    // 그룹 수정
//    @PutMapping("/api/groups/{groupId}")
//    public ResponseEntity<Group> updateGroup(@RequestHeader HttpHeaders headers,
//                                             @PathVariable long groupId,
//                                             @RequestBody UpdateGroupRequest request) {
//        String token = headers.getFirst("Authorization");
//        Long uId = jwtProvider.extractUIdFromToken(token);
//        Group updatedGroup = groupService.update(groupId, request);
//
//        return ResponseEntity.ok()
//                .body(updatedGroup);
//    }

    @PutMapping("/api/groups/{groupId}")
    public ResponseEntity<GroupDTO> updateGroup(@RequestHeader HttpHeaders headers,
                                                @PathVariable long groupId,
                                                @RequestBody UpdateGroupRequestDTO requestDTO) {
        String token = headers.getFirst("Authorization");
        Long uId = jwtProvider.extractUIdFromToken(token);
        GroupDTO updatedGroupDTO = groupService.update(groupId, requestDTO);

        return ResponseEntity.ok()
                .body(updatedGroupDTO);
    }
}