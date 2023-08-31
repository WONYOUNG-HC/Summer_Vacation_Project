import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./MyCalendar.css";

const oneDay = 24 * 60 * 60 * 1000;

const MyCalendar = forwardRef((props, ref) => {
  const calendarRef = useRef();

  useEffect(() => {
    if (props.showStartDate && props.showEndDate) {
      const dayDiff = (props.showEndDate - props.showStartDate) / oneDay + 1;

      if (dayDiff > 7) {
        calendarRef.current.getApi().changeView("dayGridMonth");
        calendarRef.current.getApi().setOption("validRange", {
          start: "1900-01-01",
          end: "2123-12-31",
        });
        calendarRef.current.getApi().gotoDate(props.showStartDate);
      } else {
        calendarRef.current.getApi().changeView("timeGrid");
        calendarRef.current.getApi().setOption("duration", {
          days: dayDiff,
        });
        calendarRef.current.getApi().gotoDate(props.showStartDate);
      }
    } else {
      props.handleDateSelect(null);
    }
  }, [props.showStartDate, props.showEndDate]);

  useImperativeHandle(ref, () => ({
    calendarUnselect,
  }));

  const calendarUnselect = () => {
    calendarRef.current.getApi().unselect();
  };

  const handleEventClick = (clickInfo) => {
    calendarUnselect();
    props.handleEventClick(clickInfo);
  };

  const renderEventContent = (eventInfo) => {
    if (eventInfo.view.type === "dayGridMonth") {
      const star = eventInfo.event.extendedProps.important && "⭐";
      return (
        <>
          {star}
          {eventInfo.event.title}
        </>
      );
    } else if (eventInfo.view.type === "timeGrid") {
      return eventInfo.event.extendedProps.important ? (
        <div className="IMPORTANTPLAN">
          <span>
            <b>{eventInfo.event.title}</b>
          </span>
          <br />
          <span>
            <b>
              <i>{eventInfo.timeText}</i>
            </b>
          </span>
        </div>
      ) : (
        <>
          <span>{eventInfo.event.title}</span>
          <br />
          <span>{eventInfo.timeText}</span>
        </>
      );
    }
  };

  return (
    <div className="my-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "",
          center: "title",
          right: "",
        }}
        //editable={true} // 일정을 드래그 해서 옮기기, need to import interactionPlugin
        selectable={true} // 달력을 클릭하거나 드래그 하여 일정 추가, need to import interactionPlugin
        // selectMirror={true} // timeGrid에서 시간을 드래그 할 대 연한색으로 드래그 되는게 아닌 실제 일정이 입력되듯이 드래그되는 효과
        dayMaxEvents={true} // 한 요일에 다중의 일정 존재시 more+로 표시되고 false로 두면 일정이 모두 표시되데 달력이 길어짐
        weekends={true} // 달력에 주말 표시
        allDaySlot={false}
        //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed 초기에 표시될 일정
        select={props.handleDateSelect} // 날짜 선택시 일정이 나타나는 방식
        eventContent={renderEventContent} // custom render function 이벤트 상세를 보여주는 내용
        eventClick={handleEventClick} // 일정 클릭시 일어날 이벤트
        events={props.events}
        ref={calendarRef}
        unselectAuto={false}
        eventClassNames="MYCALENDAR"
      />
    </div>
  );
});

export default MyCalendar;
