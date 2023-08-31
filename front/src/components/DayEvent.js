import React, { useState, useEffect, useRef } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./DayEvent.css";

function DayEvent(props) {
  const calendarRef = useRef();

  useEffect(() => {
    calendarRef.current.getApi().gotoDate(showStart);
    calendarRef.current.getApi().scrollToTime(scrollTime);
  });

  const colorList = [
    "rgba(255, 182, 193, 0.9)",
    "rgba(135, 206, 235, 0.9)",
    "rgba(211, 211, 211, 0.9)",
    "rgba(224, 176, 255, 0.9)",
    "rgba(168, 223, 142, 0.9)",
  ];

  const randInt = () => {
    return Math.floor(Math.random() * 5);
  };

  const colorIdx = [];
  for (let i = 0; i < 5; i++) {
    let k = randInt();
    while (colorIdx.includes(k)) {
      k = randInt();
    }
    colorIdx.push(k);
  }
  let cidx = 0;

  const eventContent = (eventInfo) => {
    const members = eventInfo.event.extendedProps.members;

    return (
      <div className="EVENTBOX">
        {members.map((member) => (
          <div className="show-time-event" key={member.start}>
            {member.important && "⭐"}
            <b>{member.owner + " - "}</b>
            <i>
              {member.start.toLocaleTimeString().slice(0, -3)} ~{" "}
              {member.end.toLocaleTimeString().slice(0, -3)}
            </i>
          </div>
        ))}
      </div>
    );
  };

  const showStart = props.selectInfo
    ? new Date(props.selectInfo.start)
    : new Date();
  const showEnd = new Date(showStart);

  showStart.setHours(0, 0, 0);
  showEnd.setHours(23, 30, 0);
  const showDateEvents = props.events.filter((event) => {
    return (
      (event.start.getMonth() === props.groupCalendarMonth ||
        event.end.getMonth() === props.groupCalendarMonth) &&
      event.end > showStart &&
      event.start <= showEnd
    );
  });
  showDateEvents.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }
    return left.end - right.end;
  });

  let scrollTime = "06:00:00";
  const eventsList = [];
  if (showDateEvents.length > 0) {
    scrollTime = showDateEvents[0].start.toTimeString().slice(0, 9);
    const event = {
      start: showDateEvents[0].start,
      end: showDateEvents[0].end,
      dispaly: "background",
      backgroundColor: colorList[colorIdx[cidx++ % 5]],
      extendedProps: {
        members: [
          {
            owner: showDateEvents[0].extendedProps.owner,
            start: showDateEvents[0].start,
            end: showDateEvents[0].end,
            important: showDateEvents[0].extendedProps.important,
          },
        ],
      },
    };

    eventsList.push(event);
  }
  for (let i = 1; i < showDateEvents.length; i++) {
    const idx = eventsList.length - 1;
    const member = {
      owner: showDateEvents[i].extendedProps.owner,
      start: showDateEvents[i].start,
      end: showDateEvents[i].end,
      important: showDateEvents[i].extendedProps.important,
    };

    if (eventsList[idx].end < showDateEvents[i].start) {
      const event = {
        start: showDateEvents[i].start,
        end: showDateEvents[i].end,
        dispaly: "background",
        backgroundColor: colorList[colorIdx[cidx++ % 5]],
        extendedProps: {
          members: [member],
        },
      };

      eventsList.push(event);
    } else {
      eventsList[idx].end =
        eventsList[idx].end < showDateEvents[i].end
          ? showDateEvents[i].end
          : eventsList[idx].end;
      eventsList[idx].extendedProps.members.push(member);
    }
  }

  return (
    <div className="day-event">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGrid"
        headerToolbar={{
          left: "",
          center: "",
          right: "",
        }}
        dayMaxEvents={true} // 한 요일에 다중의 일정 존재시 more+로 표시되고 false로 두면 일정이 모두 표시되데 달력이 길어짐
        weekends={true} // 달력에 주말 표시
        allDaySlot={false}
        events={eventsList}
        eventContent={eventContent}
        // eventBackgroundColor="rgba(135, 206, 235, 0.7)"
        ref={calendarRef}
        eventClassNames="DAYEVENT"
      />
    </div>
  );
}

export default DayEvent;
