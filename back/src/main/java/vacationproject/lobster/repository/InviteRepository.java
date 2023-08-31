package vacationproject.lobster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vacationproject.lobster.domain.Group;
import vacationproject.lobster.domain.Invite;
import vacationproject.lobster.domain.User;

import java.util.List;

@Repository
public interface InviteRepository extends JpaRepository<Invite, Long> {
    List<Invite> findByInviteUserIdAndStatus(User userId, char status);
    List<Invite> findByStatusAndSentAtBefore(char status, java.sql.Timestamp sentAt);

}
