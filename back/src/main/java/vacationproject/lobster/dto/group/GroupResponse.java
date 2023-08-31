package vacationproject.lobster.dto.group;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacationproject.lobster.domain.Group;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class GroupResponse {

    private Long gId;
    private String groupName;
    private int memberCnt;

    public GroupResponse(Group group){
        this.gId = group.getGId();
        this.groupName = group.getGroupName();
        this.memberCnt = group.getMemberCnt();
    }
}
