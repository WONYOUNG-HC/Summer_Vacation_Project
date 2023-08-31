package vacationproject.lobster.dto.calender;

import lombok.Getter;
import vacationproject.lobster.domain.Calender;

import java.util.Date;

@Getter
public class CalenderResponse {
    private Long cId;
    private Date day_start;
    private Date day_end;
    private String contents;
    private boolean important;
    private Long calenderOwnerId;
    private String calenderOwnerName;

    public CalenderResponse(Calender calender) {
        this.cId = calender.getCId();
        this.day_start = calender.getDay_start();
        this.day_end = calender.getDay_end();
        this.contents = calender.getContents();
        this.important = calender.isImportant();
        this.calenderOwnerId = calender.getCalenderOwner().getUId();
        this.calenderOwnerName = calender.getCalenderOwner().getUserName();
    }
}
