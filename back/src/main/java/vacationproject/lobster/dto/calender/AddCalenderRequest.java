package vacationproject.lobster.dto.calender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacationproject.lobster.domain.Calender;
import vacationproject.lobster.domain.User;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class AddCalenderRequest {

    private Date day_start;
    private Date day_end;
    private String contents;
    private boolean important;
    private User calenderOwner;

    public Calender toEntity(User calenderOwner) {
        return Calender.builder()
                .day_start(day_start)
                .day_end(day_end)
                .contents(contents)
                .important(important)
                .calenderOwner(calenderOwner)
                .build();
    }
}
