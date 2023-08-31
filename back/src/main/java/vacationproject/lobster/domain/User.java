package vacationproject.lobster.domain;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Table(name = "user")
@NoArgsConstructor
@Getter @Setter
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long uId;

    @Column(name = "login_id")
    private String userId;

    @Column(name = "password")
    private String password;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_num")
    private String phoneNum;

    @Column(name = "is_login")
    private boolean is_login;

    @Column(name = "profile_img", columnDefinition="BLOB")
    @Lob
    private byte[] profileImg;

    @OneToMany(mappedBy = "calenderOwner")
    private List<Calender> calenders = new ArrayList<>();

    @OneToMany(mappedBy = "creator")
    private List<Group> groups = new ArrayList<>();

    @OneToMany(mappedBy = "userId")
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "inviteUserId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invite> invites = new ArrayList<>();



    @Builder
    public User(String userId, String password, String userName, String email, String phoneNum) {
        this.userId = userId;
        this.password = password;
        this.userName = userName;
        this.email = email;
        this.phoneNum = phoneNum;
    }
}