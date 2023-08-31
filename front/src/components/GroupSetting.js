import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GroupCreate.css";
import "./GroupSetting.css";

var url = "http://localhost:8080";

function GroupSetting(props) {
  const [groupName, setGroupName] = useState(props.group.groupName);

  const navigate = useNavigate();

  const handleGroupUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${url}/api/groups/${props.group.gid}`,
        {
          gId: props.group.gid,
          groupName: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        props.closeGroupSettingModal();
        props.getUserInfo();
      })
      .catch((error) => {
        console.log("error in handleGroupUpdate");
        console.log(error);
      });
  };

  const handleLeaveGroup = () => {
    if (window.confirm("정말 탈퇴 하시겠습니까?")) {
      const token = localStorage.getItem("token");

      axios
        .delete(`${url}/api/groups/${props.group.gid}/leave`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          props.closeGroupSettingModal();
          props.getUserInfo();
          navigate("/layout/my_calendar");
        })
        .catch((error) => {
          console.log("error in handleLeaveGroup");
          console.log(error);
        });
    }
  };

  return (
    <div className="group-setting">
      <div className="GROUPSETTINGBOX">
        <div className="group-set">
          <h2>그룹 설정</h2>
        </div>
        <div className="input-button-container">
          <label htmlFor="group_setting" className="group_setting">
            그룹 이름 변경
          </label>
          <input
            type="text"
            id="group-setting"
            value={groupName}
            className="GROUPNAMEFORM"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className="GROUPNAMEBUT" onClick={handleGroupUpdate}>
            그룹 정보 변경
          </button>
          <div className="GROUPLEAVE" onClick={handleLeaveGroup}>
            그룹 탈퇴
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupSetting;
