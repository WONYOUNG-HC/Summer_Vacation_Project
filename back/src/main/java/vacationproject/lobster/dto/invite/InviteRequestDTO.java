package vacationproject.lobster.dto.invite;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InviteRequestDTO {
    private String token;
    private Long groupId;
    private String loginId;
}

