package vacationproject.lobster.dto.invite;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CheckResponse {
    private boolean hasPermission;
}
