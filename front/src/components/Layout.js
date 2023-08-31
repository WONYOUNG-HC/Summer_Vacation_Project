import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import LeftBar from "./LeftBar";
import MyCalendar from "./MyCalendar";
import GroupCalendar from "./GroupCalendar";
import { useNavigate } from "react-router-dom";
import RightBar from "./RightBar";
import "./Layout.css";
import BackgroundComponent from "../BG/BackgroundComponent";
import InviteGroup from "./invite/InviteGroup";
import HeaderBox from "./HeaderBox";

var url = "http://localhost:8080";

function Layout() {
  const myCalendarRef = useRef();
  const rightBarRef = useRef();

  const [userName, setUserName] = useState("");
  const [gid, setGid] = useState(0);
  const [groups, setGroups] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [eventMode, setEventMode] = useState("add");
  const [showStartDate, setShowStartDate] = useState(null);
  const [showEndDate, setShowEndDate] = useState(null);
  const [groupCalendarMonth, setGroupCalendarMonth] = useState(
    new Date().getMonth()
  );
  const [selectInfo, setSelectInfo] = useState(null);
  const [clickEvent, setClickEvent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }

    getUserInfo();
    getMyEvents(new Date());
  }, []);

  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/calenders/user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserName(response.data.userName);
        setGroups(response.data.groups);
      })
      .catch((error) => {
        console.log("error in getUserInfo");
        console.log(error);
      });
  };

  const getMyEvents = (day) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/calenders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: day.getFullYear(),
          month: day.getMonth() + 1,
        },
      })
      .then((response) => {
        const eventsList = [];
        for (let i = 0; i < response.data.length; i++) {
          eventsList.push({
            title: response.data[i].contents,
            start: new Date(response.data[i].day_start),
            end: new Date(response.data[i].day_end),
            extendedProps: {
              important: response.data[i].important,
              cid: response.data[i].cid,
            },
          });
        }
        setMyEvents(eventsList);
      })
      .catch((error) => {
        console.log("error in getMyEvents");
        console.log(error);
      });
  };

  const getGroupEvents = (gid, day) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/groups/${gid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: day.getFullYear(),
          month: day.getMonth() + 1,
        },
      })
      .then((response) => {
        const eventsList = [];
        for (let i = 0; i < response.data.combinedCalenders.length; i++) {
          const event = {
            title: response.data.combinedCalenders[i].contents,
            start: new Date(response.data.combinedCalenders[i].day_start),
            end: new Date(response.data.combinedCalenders[i].day_end),
            display: "auto",
            extendedProps: {
              owner: response.data.combinedCalenders[i].calenderOwnerName,
              important: response.data.combinedCalenders[i].important,
            },
          };

          if (event.extendedProps.important) {
            event.backgroundColor = "rgba(0, 0, 0, 1)";
          }

          eventsList.push(event);
        }
        setGroupEvents(eventsList);
      })
      .catch((error) => {
        console.log("error in getGroupEvents");
        console.log(error);
      });
  };

  const onPickerChange = (dates) => {
    const [start, end] = dates;
    if (start && end) {
      getMyEvents(start);
    }
    setShowStartDate(start);
    setShowEndDate(end);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectInfo(selectInfo);
    setClickEvent(null);
    rightBarRef.current.setShowInviteCard(false);
  };

  const handleEventClick = (clickInfo) => {
    setEventMode("modify");
    setClickEvent(clickInfo.event);
    setSelectInfo(null);
  };

  const changeEventMode = (mode) => {
    setEventMode(mode);
  };

  const changeGroupCalendarMonth = (day) => {
    setGroupCalendarMonth(day.getMonth());
  };

  const calendarUnselect = () => {
    myCalendarRef.current.calendarUnselect();
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <BackgroundComponent>
      <div className="layout">
        <div className="LEFTBOX">
          <LeftBar
            onLogout={onLogout}
            groups={groups}
            userName={userName}
            getUserInfo={getUserInfo}
          />
        </div>
        <Routes>
          <Route
            path="/my_calendar"
            element={
              <>
                <HeaderBox groups={groups} />
                <MyCalendar
                  ref={myCalendarRef}
                  showStartDate={showStartDate}
                  showEndDate={showEndDate}
                  handleDateSelect={handleDateSelect}
                  handleEventClick={handleEventClick}
                  events={myEvents}
                />
              </>
            }
          />
          <Route
            path="/group_calendar/:gid"
            element={
              <>
                <HeaderBox groups={groups} />
                <GroupCalendar
                  className="GROUPCALENDAR"
                  handleDateSelect={handleDateSelect}
                  events={groupEvents}
                  getGroupEvents={getGroupEvents}
                  setGid={setGid}
                  changeGroupCalendarMonth={changeGroupCalendarMonth}
                />
              </>
            }
          />
        </Routes>
        <RightBar
          userName={userName}
          showStartDate={showStartDate}
          showEndDate={showEndDate}
          onPickerChange={onPickerChange}
          handleDateSelect={handleDateSelect}
          selectInfo={selectInfo}
          clickEvent={clickEvent}
          myEvents={myEvents}
          groupEvents={groupEvents}
          groupCalendarMonth={groupCalendarMonth}
          eventMode={eventMode}
          changeEventMode={changeEventMode}
          calendarUnselect={calendarUnselect}
          getMyEvents={getMyEvents}
          getUserInfo={getUserInfo}
          ref={rightBarRef}
        />
      </div>
    </BackgroundComponent>
  );
}

export default Layout;
