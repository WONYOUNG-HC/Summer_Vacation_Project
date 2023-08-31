package vacationproject.lobster.dto.calender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacationproject.lobster.dto.group.GroupResponse;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ExtendedCalenderResponse {
    private String userName;
    private List<GroupResponse> groups;
    private List<CalenderResponse> calenders;
}