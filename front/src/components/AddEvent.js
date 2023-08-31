import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddEvent.css";

var url = "http://localhost:8080";

function AddEvent(props) {
  const [title, setTitle] = useState("");
  const [important, setImportant] = useState(false);

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
    setImportant(!important);
  };

  const submitEvent = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `${url}/api/calenders`,
        {
          day_start: props.selectInfo.start,
          day_end: props.selectInfo.end,
          contents: title === "" ? "일정" : title,
          important: important,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        props.calendarUnselect();
        props.handleDateSelect(null);
        props.getMyEvents(props.selectInfo.start);
        setTitle("");
        setImportant(false);
      })
      .catch((error) => {
        console.log("error in submitEvent");
        console.log(error);
      });
  };

  if (!props.selectInfo) {
    return;
  }

  let startDate = parsingDate(props.selectInfo.start);
  let endDate = null;
  if (props.selectInfo.allDay) {
    const prevEnd = new Date(props.selectInfo.end);
    prevEnd.setDate(prevEnd.getDate() - 1);
    endDate = parsingDate(prevEnd);
  } else {
    endDate = parsingDate(props.selectInfo.end);
  }
  const timeStr =
    !props.selectInfo.allDay &&
    props.selectInfo.start.toLocaleTimeString().slice(0, -3) +
      " ~ " +
      props.selectInfo.end.toLocaleTimeString().slice(0, -3);

  return (
    <div className="add-event">
      <p>
        <input
          className="title-input"
          type="text"
          value={title}
          onChange={onChangeTitle}
          placeholder="제목 추가"
          required
        />
      </p>
      <p>
        {startDate} ~ {endDate}
      </p>
      <p>{timeStr}</p>
      <p>
        중요한 일정 :
        <input
          className="CHECKBOX"
          type="checkBox"
          checked={important}
          onChange={onChangeToggle}
        ></input>
        <br />
        <div className="BUT">
          <button onClick={submitEvent}>등록</button>
        </div>
      </p>
    </div>
  );
}

export default AddEvent;
