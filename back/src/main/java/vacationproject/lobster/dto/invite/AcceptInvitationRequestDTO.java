package vacationproject.lobster.dto.invite;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter@Setter
public class AcceptInvitationRequestDTO {
    private Long groupId;
    private Long iid;

}
