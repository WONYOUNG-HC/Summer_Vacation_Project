package vacationproject.lobster.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "members")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 멤버를 구분하는 ID
    @Column(name = "member_id")
    private Long mId;

    // 그룹 테이블의 group_id와 연결되어있음
    @ManyToOne
    @JoinColumn(name = "group_id")
    //@JsonBackReference
    private Group groupId;

    // 유저 테이블의 user_id와 연결되어있음
    @ManyToOne
    @JoinColumn(name = "user_id")
    //@JsonBackReference
    private User userId;

    @Column(name = "color")
    private String color;

    public void update(Group groupId, User userId, String color) {
        this.groupId = groupId;
        this.userId = userId;
        this.color = color;
    }

    @Builder
    public Member(Group groupId, User userId, String color) {
        this.groupId = groupId;
        this.userId = userId;
        this.color = color;
    }
}