package vacationproject.lobster.domain;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import vacationproject.lobster.repository.InviteRepository;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Calendar;
import org.springframework.beans.factory.annotation.Autowired;
import vacationproject.lobster.repository.InviteRepository;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "invite")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long iId;

    @Column(name = "status")
    private char status;

    @ManyToOne
    @JoinColumn(name = "invite_gId")
    private Group inviteGroupId;

    @ManyToOne
    @JoinColumn(name = "invite_uId")
    private User inviteUserId;

    @Column(name = "sent_at")
    private java.sql.Timestamp sentAt;

    // 생성자의 매개변수 타입 수정 및 필드 순서에 맞게 조정
    @Builder
    public Invite(char status, Group inviteGroupId, User inviteUserId, java.sql.Timestamp sentAt) {
        this.status = status;
        this.inviteGroupId = inviteGroupId;
        this.inviteUserId = inviteUserId;
        this.sentAt = sentAt;
    }

    // setGroup 메서드 수정
    public void setGroup(Group group) {
        this.inviteGroupId = group;
    }

    // setUser 메서드 수정
    public void setUser(User user) {
        this.inviteUserId = user;
    }
}