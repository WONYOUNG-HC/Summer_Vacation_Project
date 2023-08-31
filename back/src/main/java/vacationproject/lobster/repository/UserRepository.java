package vacationproject.lobster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import vacationproject.lobster.domain.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUserId(String userId); // 로그인 아이디
    User findByPhoneNum(@Param("phone_num") String phoneNum);
    @Modifying
    @Query("UPDATE User u SET u.profileImg = :profileImage WHERE u.uId = :uId")
    void updateProfileImage(@Param("uId") Long uId, @Param("profileImage") byte[] profileImage);

    @Query("SELECT u.profileImg FROM User u WHERE u.uId = :uId")
    byte[] findProfileImageByUId(@Param("uId") Long uId);
}