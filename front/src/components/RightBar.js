import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Routes, Route } from "react-router-dom";
import DatePicker from "react-datepicker";
import AddEvent from "./AddEvent";
import ManageEvent from "./ManageEvent";
import "react-datepicker/dist/react-datepicker.css";
import "./RightBar.css";
import ProfileBox from "./ProfileBox";
import InviteCard from "./invite/InviteCard";
import DayEvent from "./DayEvent";

const RightBar = forwardRef((props, ref) => {
  const [showInviteCard, setShowInviteCard] = useState(false);

  useImperativeHandle(ref, () => ({
    setShowInviteCard,
  }));

  const toggleInviteCard = () => {
    setShowInviteCard(!showInviteCard);
  };

  const changeRightBarContent = () => {
    // 프로필 박스에서 이미지 버튼을 눌렀을 때 내용 변경
    // showInviteCard 상태를 토글합니다.
    setShowInviteCard(!showInviteCard);
  };

  return (
    <div className="right-bar">
      <div className="PROFILE_BOX">
        <div className="USERNAME_BOX">
          <ProfileBox
            userName={props.userName}
            changeRightBarContent={changeRightBarContent}
          />
        </div>
      </div>
      <br />
      {showInviteCard ? (
        <div className="INVITEBOX">
          <InviteCard getUserInfo={props.getUserInfo} />
        </div>
      ) : (
        <Routes>
          <Route
            path="/my_calendar"
            element={
              <div className="RIGHT_CALENDAR">
                <DatePicker
                  selected={props.showStartDate}
                  onChange={props.onPickerChange}
                  startDate={props.showStartDate}
                  endDate={props.showEndDate}
                  selectsRange
                  inline
                />
                <br />
                {props.eventMode === "add" ? (
                  <AddEvent
                    selectInfo={props.selectInfo}
                    getMyEvents={props.getMyEvents}
                    handleDateSelect={props.handleDateSelect}
                    calendarUnselect={props.calendarUnselect}
                  />
                ) : (
                  <ManageEvent
                    selectInfo={props.selectInfo}
                    clickEvent={props.clickEvent}
                    changeEventMode={props.changeEventMode}
                    handleDateSelect={props.handleDateSelect}
                    calendarUnselect={props.calendarUnselect}
                    getMyEvents={props.getMyEvents}
                  />
                )}
              </div>
            }
          />
          <Route
            path="/group_calendar/:gid"
            element={
              <DayEvent
                events={props.groupEvents}
                selectInfo={props.selectInfo}
                groupCalendarMonth={props.groupCalendarMonth}
              />
            }
          />
        </Routes>
      )}

      <div className="ALERT" onClick={toggleInviteCard}>
        {/* 알람 아이콘 */}
      </div>
    </div>
  );
});

export default RightBar;
