package vacationproject.lobster.dto.invite;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class InviteDTO {

    private Long iId;
    private char status;
    private java.sql.Timestamp sentAt;
    private Long inviteGroupId;
    private String groupName; // 그룹 이름 필드 추가
    private String creatorName;
}
