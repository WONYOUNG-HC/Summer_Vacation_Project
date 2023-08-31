import React, { useState } from "react";
import axios from "axios";
import "./GroupCreate.css";

var url = "http://localhost:8080";

function GroupCreate(props) {
  const [groupName, setGroupName] = useState(`${props.userName}님의 그룹`);
  const [inviteMember, setInviteMember] = useState("");
  const [inviteList, setInviteList] = useState([]);

  const onChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const onChangeGroupInvite = (e) => {
    setInviteMember(e.target.value);
  };

  const onSubmit = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `${url}/api/groups`,
        {
          groupName: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        props.getUserInfo();
      })
      .catch((error) => {
        console.log("error in GroupCreate onSubmit");
        console.log(error);
      });

    props.closeModal();
  };

  return (
    <div className="group-create">
      <div className="create-comment">
        <h2>그룹 만들기</h2>
      </div>
      <div className="input-button-container">
        <label htmlFor="group-name">그룹 명</label>
        <input
          type="text"
          id="group-name"
          value={groupName}
          onChange={onChangeGroupName}
        />
        <button onClick={onSubmit}>그룹 생성</button>
      </div>
    </div>
  );
}

export default GroupCreate;
