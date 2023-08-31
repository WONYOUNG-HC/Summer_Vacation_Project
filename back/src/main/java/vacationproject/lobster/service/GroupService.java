package vacationproject.lobster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.Member;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.calender.CalenderResponse;
import vacationproject.lobster.dto.group.*;
import vacationproject.lobster.repository.GroupRepository;
import vacationproject.lobster.repository.MemberRepository;
import vacationproject.lobster.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Transactional
@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final CalenderService calenderService;

    // Group 등록
    public Group save(AddGroupRequest groupRequest, Long uId) {
        User creator = userRepository.findById(uId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // Group 엔티티 생성
        Group group = groupRequest.toEntity(creator);
        Group savedGroup = groupRepository.save(group);

        Member creatorMember = Member.builder()
                .groupId(savedGroup)
                .userId(creator)
                .color("default") // 생성자의 기본 색상 설정
                .build();

        memberRepository.save(creatorMember);

        group.updateMemberCount(memberRepository);

        return savedGroup;
    }

    //Group 전체 조회
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    //Group id로 조회
    public Group findById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));
    }

    // Group 삭제
    public void delete(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        // Group에 속한 모든 멤버 삭제
        for (Member member : group.getMembers()) {
            memberRepository.delete(member);
        }

        // Group 삭제
        groupRepository.delete(group);
    }


    // Group 탈퇴
    public void leaveGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid group ID."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // 해당 그룹에 속한 모든 멤버 조회
        List<Member> members = group.getMembers();

        // 그룹 생성자인 경우 그룹 삭제 및 멤버들 삭제
        if (group.getCreator().equals(user)) {
            for (Member member : members) {
                memberRepository.deleteById(member.getMId());
            }
            delete(groupId);
        } else {
            // 그룹에서 해당 사용자 삭제
            for (Member member : members) { // Member 엔티티의 userId 필드에 있는 User 엔티티의 userId 필드를 비교
                if (member.getGroupId().getGId().equals(groupId) && member.getUserId().getUId().equals(userId)) {
                    memberRepository.deleteById(member.getMId());
                    // Group 엔티티의 멤버 수 감소 메서드 호출
                    groupRepository.decrementMemberCount(groupId);
                    break;
                }
            }
        }
        group.updateMemberCount(memberRepository);
    }

    //uId로 그룹 찾기
    public List<Group> getGroupsByUserId(Long uId) {
        User user = userRepository.findById(uId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + uId));

        List<Group> groups = new ArrayList<>();

        // 해당 유저가 속한 멤버 목록을 찾아서 그룹 ID를 가져옵니다.
        List<Member> userMemberships = memberRepository.findByUserId(user);
        for (Member member : userMemberships) {
            groups.add(member.getGroupId());
        }

        return groups;
    }

    //그룹에 속하는 그룹원들 반환
    public List<GroupUsersResponse> getGroupUsers(Long groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + groupId));

        List<Member> members = memberRepository.findByGroupId(group);
        List<User> groupUsers = members.stream()
                .map(Member::getUserId) // 각 멤버에서 userId 추출
                .collect(Collectors.toList());

        List<GroupUsersResponse> groupUsersResponse = groupUsers.stream()
                .map(user -> new GroupUsersResponse(user.getUserId(), user.getUserName(), user.getProfileImg()))
                .collect(Collectors.toList());
        return groupUsersResponse;
    }


    // 그룹원들 달력 한 달력에 모아주기
    public CombinedCalenderResponse getCombinedCalenderForGroup(Long groupId, int year, int month) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + groupId));

        List<CalenderResponse> combinedCalenders = new ArrayList<>();
        for (Member member : group.getMembers()) {
            List<CalenderResponse> userCalendersForMonth = calenderService.getCalendersForMonth(member.getUserId().getUId(), year, month);
            combinedCalenders.addAll(userCalendersForMonth);
        }

        return new CombinedCalenderResponse(combinedCalenders);
    }


    //Group 수정 (이름만 수정 가능) 멤버 수는 자동으로 갱신되게, 그룹 생성자는 안바뀌게
    public GroupDTO  update(Long gId, UpdateGroupRequestDTO requestDTO) {
        Group group = groupRepository.findById(gId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + gId));

        group.update(requestDTO.getGroupName());
        GroupDTO responseDTO = new GroupDTO(group.getGroupName(), group.getMemberCnt());

        return responseDTO;
    }
}