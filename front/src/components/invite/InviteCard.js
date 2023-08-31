import axios from "axios";
import React, { useState, useEffect } from "react";
import "./InviteCard.css";

var url = "http://localhost:8080";

function InviteCard(props) {
  const [invitations, setInvitations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // 초대 카드 로딩 상태 추가

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${url}/api/inviteCard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInvitations(response.data);
      })
      .catch((error) => {
        console.log("error in InviteCard");
        console.log(error);
      })
      .finally(() => {
        setIsLoaded(true); // 초대 카드 정보를 가져오든 실패하든 로딩이 끝났음을 설정
      });
  }, [token]);

  // 초대 수락 함수
  const handleAcceptInvitation = (iid, inviteGroupId) => {
    const requestBody = {
      iid: iid,
      groupId: inviteGroupId,
    };

    axios
      .post(`${url}/api/acceptInvitation`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        props.getUserInfo();
      })
      .catch((error) => {
        console.log("error in handleAcceptInvitation");
        console.log(error);
      });
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invite) => invite.iid !== iid)
    );
  };

  // 초대 거절 함수
  const handleRejectInvitation = (iid, inviteGroupId) => {
    const requestBody = {
      iid: iid,
      groupId: inviteGroupId,
    };

    axios
      .post(`${url}/api/rejectInvitation`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.log("error in handleRejectInvitation");
        console.log(error);
      });
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invite) => invite.iid !== iid)
    );
  };

  return (
    <div className="INVITEBOX">
      {isLoaded ? ( // 초대 카드 로딩이 완료됐을 때
        invitations.length === 0 ? (
          <p className="NO_INVITES">받은 초대가 없습니다...</p>
        ) : (
          invitations.map((invite) => (
            <div className={`INVITECARD show`} key={invite.iid}>
              <div className="INVITECONTENT">
                <span className="CREATOR_NAME">{invite.creatorName}</span>
                님이 <span className="GROUP_NAME">{invite.groupName}</span>{" "}
                그룹으로
                <br></br>
                초대했어요.
              </div>
              <div className="INVITECARDBUTTON">
                <button
                  className="ACPBUTTON"
                  onClick={() =>
                    handleAcceptInvitation(invite.iid, invite.inviteGroupId)
                  }
                >
                  수락
                </button>
                <button
                  className="REJBUTTON"
                  onClick={() =>
                    handleRejectInvitation(invite.iid, invite.inviteGroupId)
                  }
                >
                  거절
                </button>
              </div>
            </div>
          ))
        )
      ) : (
        <p className="LOADING"></p>
      )}
    </div>
  );
}

export default InviteCard;
