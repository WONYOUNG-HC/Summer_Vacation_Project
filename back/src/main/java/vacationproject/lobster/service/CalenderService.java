package vacationproject.lobster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vacationproject.lobster.Security.JwtProvider;
import vacationproject.lobster.domain.Calender;
import vacationproject.lobster.domain.User;
import vacationproject.lobster.dto.calender.AddCalenderRequest;
import vacationproject.lobster.dto.calender.CalenderResponse;
import vacationproject.lobster.dto.calender.UpdateCalenderRequest;
import vacationproject.lobster.repository.CalenderRepository;
import vacationproject.lobster.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Transactional
@Service
public class CalenderService {

    private final CalenderRepository calenderRepository;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    // 일정 생성
    public Calender save(AddCalenderRequest calenderRequest, Long uId) {
        User user = userRepository.findById(uId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        /*Date startDateTime = calenderRequest.getDay_start();
        Date endDateTime = calenderRequest.getDay_end();*/
        //Calender newCalender = new Calender(startDateTime, endDateTime, calenderRequest.getContents(), calenderRequest.isImportant(), user);

        return calenderRepository.save(calenderRequest.toEntity(user));
    }

    // CalenderOwner id로 해당 사용자의 일정들 가져오기
    public List<Calender> findUserCalenders(Long uId) {
        return calenderRepository.findByCalenderOwnerId(uId);
    }


    // 특정 달 및 앞뒤 3달치 일정 가져오기
    public List<CalenderResponse> getCalendersForMonth(Long uId, int year, int month) {
        List<Calender> calenders = calenderRepository.findByCalenderOwnerId(uId);

        YearMonth targetMonth = YearMonth.of(year, month);

        LocalDate startDate = targetMonth.atDay(1).minusMonths(1); // 앞 달의 시작일
        LocalDate endDate = targetMonth.atEndOfMonth().plusMonths(1); // 뒷 달의 마지막일

        return filterCalendersByDateRange(calenders, startDate, endDate);
    }

    // 특정 기간에 해당하는 일정만 필터링하는 메서드
    private List<CalenderResponse> filterCalendersByDateRange(List<Calender> calenders, LocalDate startDate, LocalDate endDate) {
        List<CalenderResponse> calendersInRange = new ArrayList<>();
        for (Calender calender : calenders) {
            LocalDateTime calenderStartDateTime = calender.getDay_start().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            LocalDateTime calenderEndDateTime = calender.getDay_end().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

            if (!calenderStartDateTime.toLocalDate().isBefore(startDate) && !calenderStartDateTime.toLocalDate().isAfter(endDate)) {
                calendersInRange.add(new CalenderResponse(calender));
            } else if (!calenderEndDateTime.toLocalDate().isBefore(startDate) && !calenderEndDateTime.toLocalDate().isAfter(endDate)) {
                calendersInRange.add(new CalenderResponse(calender));
            }
        }
        return calendersInRange;
    }


    // 일정 조회
    public Calender findById(Long calenderId) {
        return calenderRepository.findById(calenderId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + calenderId));
    }

    // 일정 삭제
    public void delete(Long calenderId) {
        calenderRepository.deleteById(calenderId);
    }

    // 일정 수정
    public Calender update(Long calenderId, UpdateCalenderRequest calenderRequest) {
        Calender existingCalender = calenderRepository.findById(calenderId)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다"));

        // 기존 일정의 정보를 가져와서 업데이트합니다.
        existingCalender.update(calenderRequest.getDay_start(), calenderRequest.getDay_end(), calenderRequest.getContents(), calenderRequest.isImportant());

        return calenderRepository.save(existingCalender);
    }
}