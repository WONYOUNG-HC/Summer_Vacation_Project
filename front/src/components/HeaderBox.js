import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InviteGroup from "./invite/InviteGroup";
import Modal from "react-modal";

import "./HeaderBox.css";

var url = "http://localhost:8080";

function HeaderBox(props) {
  const [isCreater, setIsCreater] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const imageFolder = "/profile";
  const { gid } = useParams();

  useEffect(() => {
    if (gid) {
      const token = localStorage.getItem("token");
      axios
        .get(`${url}/api/checkCreator`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            groupId: gid,
          },
        })
        .then((response) => {
          if (response.data === "success") {
            setIsCreater(true); // 버튼을 보이게 설정
          }
        })
        .catch((error) => {
          if (error.request.response === "failure") {
            setIsCreater(false); // 버튼을 숨김으로 설정
          } else {
            console.log("error in HeaderBox");
            console.log(error);
          }
        });
    }
  }, [gid]);

  const handleInviteClick = () => {
    setIsInviteModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };

  const getGroupName = () => {
    for (let i = 0; i < props.groups.length; i++) {
      if (props.groups[i].gid === Number(gid)) {
        return props.groups[i].groupName;
      }
    }

    return "";
  };

  const [isGroupMembersModalOpen, setIsGroupMembersModalOpen] = useState(false); // State for controlling group members modal
  const [groupMembers, setGroupMembers] = useState([]); // State to store the list of group members

  // 그룹원 정보 불러오기
  const handleUserListClick = () => {
    if (gid) {
      const token = localStorage.getItem("token");
      axios
        .get(`${url}/api/groups/${gid}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setGroupMembers(response.data); // Store the fetched group members in state
          setIsGroupMembersModalOpen(true); // Open the modal
        })
        .catch((error) => {
          console.log("error in handleUserListClick");
          console.log(error);
          setGroupMembers([]); // Reset the group members state in case of an error
        });
    }
  };

  return (
    <div>
      <div className="C_INFO">
        <p className="C_CONTENT">{gid ? getGroupName() : "내 일정 관리"}</p>
      </div>
      {gid && (
        <>
          <div className="GROUPMAMBER">
            <img
              className="USERLISTIMG"
              src={`${imageFolder}/team.png`}
              alt="User List"
              onClick={handleUserListClick}
            />
          </div>
          {isCreater && (
            <div className="GROUPINVITE">
              <div className="PLUSBUT" onClick={handleInviteClick}>
                +
              </div>
            </div>
          )}
        </>
      )}
      <InviteGroup
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
        gid={gid}
      />

      <Modal
        isOpen={isGroupMembersModalOpen}
        onRequestClose={() => setIsGroupMembersModalOpen(false)}
        className="modal-1"
      >
        <div className="SHOWGROUPLIST">
          <h2 className="SHOWGROUPLIST_T"> 그룹원 목록 </h2>
          {groupMembers.map((member, index) => (
            <div key={index} className="MemberBox">
              <img
                src={
                  member.profileImg
                    ? `data:image/png;base64,${member.profileImg}`
                    : "/profile/default.png"
                }
                alt={`${member.userName} Profile`}
              />
              <p>{member.userName} 님</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default HeaderBox;
