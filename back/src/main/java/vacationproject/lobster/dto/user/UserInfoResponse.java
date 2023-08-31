package vacationproject.lobster.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacationproject.lobster.dto.group.GroupResponse;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class UserInfoResponse {
    private String userName;
    private List<GroupResponse> groups;
}
