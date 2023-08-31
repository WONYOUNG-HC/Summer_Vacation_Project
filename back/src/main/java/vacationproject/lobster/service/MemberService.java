package vacationproject.lobster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vacationproject.lobster.domain.Member;
import vacationproject.lobster.dto.member.AddMemberRequest;
import vacationproject.lobster.dto.member.UpdateMemberRequest;
import vacationproject.lobster.repository.GroupRepository;
import vacationproject.lobster.repository.MemberRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    //Member 생성
    public Member save(AddMemberRequest memberRequest) {
        return memberRepository.save(memberRequest.toEntity());
    }

    //Member 전체 조회
    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    //Member id로 조회
    public Member findById(Long mId) {
        return memberRepository.findById(mId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + mId));
    }

    //Member 삭제
    public void delete(Long memberId){
        memberRepository.deleteById(memberId);
    }

    //Member 수정
    public Member update(Long mId, UpdateMemberRequest request) {
        Member member = memberRepository.findById(mId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + mId));

        member.update(request.getGroupId(), request.getUserId(), request.getColor());

        return member;
    }
}
