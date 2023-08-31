package vacationproject.lobster.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vacationproject.lobster.Security.JwtProvider;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.Invite;
import vacationproject.lobster.domain.Member;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.invite.InviteDTO;
import vacationproject.lobster.dto.invite.InviteRequestDTO;
import vacationproject.lobster.repository.GroupRepository;
import vacationproject.lobster.repository.InviteRepository;
import vacationproject.lobster.repository.MemberRepository;
import vacationproject.lobster.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

import java.sql.Timestamp;

@Service
public class InviteService {

    private final InviteRepository inviteRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;

    public InviteService(InviteRepository inviteRepository, GroupRepository groupRepository,
                         UserRepository userRepository, JwtProvider jwtProvider, MemberRepository memberRepository) {
        this.inviteRepository = inviteRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.memberRepository = memberRepository;
    }

    // invite DB에 저장하기
    public void sendInvitation(InviteRequestDTO inviteRequest) {
        String parsedToken = inviteRequest.getToken().substring("Bearer ".length());
        Long userIdFromToken = jwtProvider.extractUIdFromToken(parsedToken);

        // 초대 정보를 Invite 엔티티로 변환하여 저장
        User invitedUser = userRepository.findByUserId(inviteRequest.getLoginId());
        if (invitedUser == null) {
            throw new IllegalArgumentException("User not found");
        }

        Group invitedGroup = groupRepository.findById(inviteRequest.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        Invite invite = Invite.builder()
                .status('p') // 'p'는 보류 상태를 의미
                .sentAt(new Timestamp(System.currentTimeMillis()))
                .inviteGroupId(invitedGroup) // groupId 대신에 inviteGroupId 사용
                .inviteUserId(invitedUser)   // userId 대신에 inviteUserId 사용
                .build();

        inviteRepository.save(invite);
    }




    // 초대 카드 조회
    public List<InviteDTO> getPendingInvitationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<Invite> pendingInvites = inviteRepository.findByInviteUserIdAndStatus(user, 'p');
        List<InviteDTO> inviteDTOs = new ArrayList<>();

        for (Invite invite : pendingInvites) {
            Group group = invite.getInviteGroupId();
            String groupName = group != null ? group.getGroupName() : null;

            String creatorName = group != null ? group.getCreator().getUserName() : null; // 생성자의 이름 가져오기

            InviteDTO inviteDTO = new InviteDTO(
                    invite.getIId(),
                    invite.getStatus(),
                    invite.getSentAt(),
                    invite.getInviteGroupId().getGId(),
                    groupName,
                    creatorName // 생성자의 이름 추가
            );
            inviteDTOs.add(inviteDTO);
        }

        return inviteDTOs;
    }


    // 해당 그룹에 멤버 추가 기능
    @Transactional
    public void addMemberToGroup(long groupId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("user not found "));

        // 그룹이 데이터베이스에 있는지 확인하고 있으면 memberCnt를 1 증가시킵니다.
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        groupRepository.incrementMemberCount(groupId);


        Member member = Member.builder()
                .groupId(group)
                .userId(user)
                .color("some_color") // 멤버의 컬러 정보를 추가로 설정하려면 이 부분을 수정
                .build();

        memberRepository.save(member);

    }

    // 수락해서 p -> a로
    public void acceptInvitationAndUpdateStatus(Long iId) {
        // 초대 정보를 찾아서 status를 "p"에서 "a"로 변경
        Invite invite = inviteRepository.findById(iId).orElseThrow(()-> new IllegalArgumentException("group not found"));
        if (invite != null) {
            invite.setStatus('a');
            inviteRepository.save(invite);
        }
    }

    // 거절해서 p -> r로
    public void rejectInvitationAndUpdateStatus(Long iId) {
        // 초대 정보를 찾아서 status를 "p"에서 "a"로 변경
        Invite invite = inviteRepository.findById(iId).orElseThrow(()-> new IllegalArgumentException("group not found"));
        if (invite != null) {
            invite.setStatus('r');
            inviteRepository.save(invite);
        }
    }

    @Transactional
    public void deleteExpiredInvites() {
        java.sql.Timestamp currentDate = new java.sql.Timestamp(System.currentTimeMillis());
        List<Invite> expiredInvites = inviteRepository.findByStatusAndSentAtBefore('p', currentDate);
        inviteRepository.deleteAll(expiredInvites);
    }


}