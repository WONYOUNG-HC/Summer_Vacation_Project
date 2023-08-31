import React, { useState } from "react";
import axios from "axios";

import Modal from "react-modal";
import "./InviteGroup.css";

var url = "http://localhost:8080";

function InviteGroup(props) {
  const [loginId, setLoginId] = useState(""); // State to hold the login ID input

  const handleInviteClick = () => {
    // Call the API to send an invitation
    const token = localStorage.getItem("token");

    axios
      .post(
        `${url}/api/invite`,
        {
          groupId: props.gid,
          loginId: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        modalClose();
      })
      .catch((error) => {
        console.log("error in handleInviteClick");
        console.log(error);
        alert("아이디가 올바르지 않습니다.");
      });
  };

  const modalClose = () => {
    setLoginId("");
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={modalClose}
      shouldReturnFocusAfterClose={false}
      className="invite-modal"
      overlayClassName="modal-overlay"
    >
      <div className="invite-modal-content">
        <h2>그룹 초대</h2>
        <input
          type="text"
          placeholder="초대할 그룹원의 아이디를 입력하세요"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <button onClick={handleInviteClick}>초대 하기</button>
      </div>
    </Modal>
  );
}

export default InviteGroup;
