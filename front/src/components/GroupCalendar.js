import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./GroupCalendar.css";

const url = "http://localhost:8080";

function GroupCalendar(props) {
  const calendarRef = useRef();

  const { gid } = useParams();

  useEffect(() => {
    props.setGid(gid);
    const day = new Date();
    calendarRef.current.getApi().gotoDate(day);
    props.getGroupEvents(gid, day);
  }, [gid]);

  const parsingDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const events = props.events.map((event) => ({
    ...event,
    start: parsingDate(event.start),
    end: parsingDate(event.end),
    display: "background",
  }));

  const selectAllow = (selectInfo) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDay = selectInfo.start;
    const endDay = selectInfo.end - oneDay;
    const count = Math.round(Math.abs((startDay - endDay) / oneDay));
    return count < 1 ? true : false;
  };

  const handleDatesSet = (dateInfo) => {
    const day = dateInfo.start;
    day.setMonth(day.getMonth() + 1);
    props.changeGroupCalendarMonth(day);
    props.getGroupEvents(gid, day);
  };

  return (
    <div className="group-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
          // right: "prev, next",
        }}
        dayMaxEvents={true} // 한 요일에 다중의 일정 존재시 more+로 표시되고 false로 두면 일정이 모두 표시되데 달력이 길어짐
        weekends={true} // 달력에 주말 표시
        //initialEvents={props.events} // alternatively, use the `events` setting to fetch from a feed 초기에 표시될 일정
        selectable={true}
        select={props.handleDateSelect} // 날짜 선택시 일정이 나타나는 방식
        selectAllow={selectAllow}
        datesSet={handleDatesSet}
        events={events}
        eventContent={() => ""}
        eventBackgroundColor="skyblue"
        ref={calendarRef}
      />
    </div>
  );
}

export default GroupCalendar;
