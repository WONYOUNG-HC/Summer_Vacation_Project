import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageEvent.css";

const url = "http://localhost:8080";

function ManageEvent(props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [title, setTitle] = useState("");
  const [important, setImportant] = useState(false);
  const [cid, setCid] = useState(0);

  useEffect(() => {
    if (props.clickEvent) {
      setStartDate(parsingDate(props.clickEvent.start));
      const end = new Date(props.clickEvent.end);
      if (end.getHours() + end.getMinutes() + end.getSeconds() === 0) {
        end.setDate(end.getDate() - 1);
        setEndDate(parsingDate(end));
      } else {
        setEndDate(parsingDate(end));
        setTimeStr(
          props.clickEvent.start.toLocaleTimeString().slice(0, -3) +
            " ~ " +
            props.clickEvent.end.toLocaleTimeString().slice(0, -3)
        );
      }

      setTitle(props.clickEvent.title);
      setImportant(props.clickEvent.extendedProps.important);
      setCid(props.clickEvent.extendedProps.cid);
    } else if (props.selectInfo) {
      setStartDate(parsingDate(props.selectInfo.start));
      if (props.selectInfo.allDay) {
        const prevEnd = new Date(props.selectInfo.end);
        prevEnd.setDate(prevEnd.getDate() - 1);
        setEndDate(parsingDate(prevEnd));
      } else {
        setEndDate(parsingDate(props.selectInfo.end));
        setTimeStr(
          props.selectInfo.start.toLocaleTimeString().slice(0, -3) +
            " ~ " +
            props.selectInfo.end.toLocaleTimeString().slice(0, -3)
        );
      }
    }
  }, [props.clickEvent, props.selectInfo]);

  const parsingDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeToggle = (e) => {
    e.preventDefault();
    setImportant((prevImportant) => !prevImportant);
  };

  const changeEvent = () => {
    if (window.confirm("일정을 변경 하시겠습니까?")) {
      const token = localStorage.getItem("token");

      const { start, end } = props.selectInfo
        ? props.selectInfo
        : props.clickEvent;

      axios
        .put(
          `${url}/api/calenders`,
          {
            cid: cid,
            day_start: start,
            day_end: end,
            contents: title,
            important: important,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          changeEventModeAdd();
          props.getMyEvents(start);
        })
        .catch((error) => {
          console.log("error in changeEvent");
          console.log(error);
        });
    }
  };

  // 삭제
  const deleteEvent = () => {
    if (window.confirm("일정을 삭제 하시겠습니까?")) {
      const token = localStorage.getItem("token");
      axios
        .delete(`${url}/api/calenders`, {
          params: {
            cId: cid,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          changeEventModeAdd();
          props.getMyEvents(new Date());
        })
        .catch((error) => {
          console.log("error in deleteEvent");
          console.log(error);
        });
    }
  };

  const changeEventModeAdd = () => {
    props.changeEventMode("add");
    props.calendarUnselect();
    props.handleDateSelect(null);
    setTitle("");
    setImportant(false);
  };

  return (
    <div className="manage-event">
      <input
        className="title-input"
        type="text"
        value={title}
        onChange={onChangeTitle}
        placeholder="제목 추가"
        required
      />
      <p>
        {startDate} ~ {endDate}
      </p>
      <p>{timeStr}</p>
      <p>
        중요한 일정{" "}
        <input
          className="CHECKBOX"
          type="checkBox"
          checked={important}
          onChange={onChangeToggle}
        ></input>
        <div className="THREEBUT">
          <button className="THREEBUT1" onClick={changeEvent}>
            변경
          </button>
          <button className="THREEBUT2" onClick={deleteEvent}>
            삭제
          </button>
          <button className="THREEBUT3" onClick={changeEventModeAdd}>
            취소
          </button>
        </div>
      </p>
    </div>
  );
}

export default ManageEvent;
