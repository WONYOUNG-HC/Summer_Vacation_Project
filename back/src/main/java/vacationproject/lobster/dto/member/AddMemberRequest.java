package vacationproject.lobster.dto.member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.Member;
import vacationproject.lobster.domain.User;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddMemberRequest {

    private Group groupId;
    private User userId;
    private String color;

    public Member toEntity() {
        return Member.builder()
                .groupId(groupId)
                .userId(userId)
                .color(color)
                .build();
    }
}
