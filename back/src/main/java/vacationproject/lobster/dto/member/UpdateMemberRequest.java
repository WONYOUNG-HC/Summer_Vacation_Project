package vacationproject.lobster.dto.member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.User;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateMemberRequest {
    private Group groupId;
    private User userId;
    private String color;
}
