package vacationproject.lobster.dto.group;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vacationproject.lobster.dto.calender.CalenderResponse;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CombinedCalenderResponse {
    private List<CalenderResponse> combinedCalenders;
}
