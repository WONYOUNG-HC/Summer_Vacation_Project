package vacationproject.lobster.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Table(name = "calender")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Calender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calender_id")
    private Long cId;

    @Column(name = "day_start")
    private Date day_start;

    @Column(name = "day_end")
    private Date day_end;

    @Column(name = "contents")
    private String contents;

    @Column(name = "important")
    private boolean important;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User calenderOwner;

    public void update(Date day_start, Date day_end, String contents, boolean important) {
        this.day_start = day_start;
        this.day_end = day_end;
        this.contents = contents;
        this.important = important;
    }

    @Builder
    public Calender(Date day_start, Date day_end, String contents, boolean important, User calenderOwner) {
        this.day_start = day_start;
        this.day_end = day_end;
        this.contents = contents;
        this.important = important;
        this.calenderOwner = calenderOwner;
    }

}
