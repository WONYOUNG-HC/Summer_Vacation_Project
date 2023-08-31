import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import GroupCreate from "./GroupCreate";
import "./LeftBar.css";
import GroupSetting from "./GroupSetting";

function LeftBar(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupSettingModalOpen, setIsGroupSettingModalOpen] = useState(false);

  const imageFolder = "/profile"; // 이미지가 위치한 폴더 경로

  const handleLogout = () => {
    // 로그아웃 시에 필요한 동작 수행
    localStorage.removeItem("token");

    props.onLogout();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const goMainPage = () => {
    window.location.reload();
  };

  // 그룹 정보 변경 모달
  const openGroupSettingModal = (group) => {
    setSelectedGroup(group); // Set the selected group ID
    setIsGroupSettingModalOpen(true);
  };

  const closeGroupSettingModal = () => {
    setIsGroupSettingModalOpen(false);
  };

  return (
    <div className="left-bar">
      <div className="FRISTBOX" onClick={goMainPage}>
        <h2>모꼬지</h2>
      </div>
      <Link to="/layout/my_calendar">
        <div className="SECONDBOX">
          <img
            className="SMALLCAL"
            alt="small-calendar"
            src={`${imageFolder}/calendar.png`}
          />
          <p className="MYCAL">내 일정 관리</p>
        </div>
      </Link>
      <div className="group-list">
        <p className="GROUPDOT">그룹</p>
        <button onClick={openModal}>+</button>
        <ul className="GROUPLIST">
          {props.groups.map((group) => (
            <Link to={`/layout/group_calendar/${group.gid}`} key={group.gid}>
              <li key={group.gid}>&nbsp;{group.groupName}</li>
              <img
                className="gear-icon"
                src={`${imageFolder}/setting.png`}
                alt="Gear Icon"
                onClick={() => openGroupSettingModal(group)} // Use a lambda function here
                id={group.gid}
              />
            </Link>
          ))}
        </ul>
      </div>
      <button className="LOGINOUTBT" onClick={handleLogout}>
        로그아웃
      </button>{" "}
      {/* 로그아웃 버튼 */}
      <Modal
        className="group-create-modal"
        isOpen={isModalOpen}
        closeModal={closeModal}
        onRequestClose={closeModal}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px", // 원하는 너비로 설정
            height: "300px",
            maxHeight: "70%", // 원하는 최대 높이로 설정
            border: "none", // 테두리 제거
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // 그림자 추가
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "10px", // 더 부드러운 모서리 조절
            outline: "none",
            padding: "20px",
          },
        }}
      >
        <GroupCreate
          userName={props.userName}
          getUserInfo={props.getUserInfo}
          closeModal={closeModal}
        />
      </Modal>
      <Modal
        className="group-setting-modal"
        isOpen={isGroupSettingModalOpen}
        onRequestClose={closeGroupSettingModal}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px", // 원하는 너비로 설정
            height: "330px",
            maxHeight: "70%", // 원하는 최대 높이로 설정
            border: "none", // 테두리 제거
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // 그림자 추가
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "10px", // 더 부드러운 모서리 조절
            outline: "none",
            padding: "20px",
          },
        }}
      >
        <GroupSetting
          group={selectedGroup}
          getUserInfo={props.getUserInfo}
          closeGroupSettingModal={closeGroupSettingModal}
        />
      </Modal>
    </div>
  );
}

export default LeftBar;
