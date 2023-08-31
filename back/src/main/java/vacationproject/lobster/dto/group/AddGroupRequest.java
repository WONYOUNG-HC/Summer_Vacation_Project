package vacationproject.lobster.dto.group;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.User;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class AddGroupRequest {

    private String groupName;
    private int memberCnt;
    private User creator;

    public Group toEntity(User creator) {
        return Group.builder()
                .groupName(groupName)
                .creator(creator)
                .build();
    }
}