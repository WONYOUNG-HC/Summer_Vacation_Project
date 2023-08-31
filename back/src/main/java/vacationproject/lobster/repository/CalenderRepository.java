package vacationproject.lobster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vacationproject.lobster.domain.Calender;

import java.util.List;

public interface CalenderRepository extends JpaRepository<Calender, Long> {
    @Query("SELECT c FROM Calender c WHERE c.calenderOwner.uId = :userId")
    List<Calender> findByCalenderOwnerId(@Param("userId") Long userId);
}