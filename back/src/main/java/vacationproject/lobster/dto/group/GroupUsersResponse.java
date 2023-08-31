package vacationproject.lobster.dto.group;

import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;
import vacationproject.lobster.domain.User;

import java.util.List;

@Getter
@Setter
public class GroupUsersResponse {
    private String userId;
    private String userName;
    @Lob
    private byte[] profileImg;

    public GroupUsersResponse(String userId, String userName, byte[] profileImg) {
        this.userId = userId;
        this.userName = userName;
        this.profileImg = profileImg;
    }
}
