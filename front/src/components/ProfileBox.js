import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import ImageSelection from "./ImageSelection";
import "./ProfileBox.css";

var url = "http://localhost:8080";

function ProfileBox(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // 초기값을 null로 설정

  const imageFolder = "/profile"; // 이미지가 위치한 폴더 경로

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // 모달이 닫힐 때 프로필 이미지 업데이트 호출
    updateProfileImage();
  };

  const updateProfileImage = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${url}/api/profile-image`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const imageBytes = new Uint8Array(response.data);

        if (imageBytes.length > 0) {
          const imageDataURL =
            "data:image/png;base64," +
            btoa(String.fromCharCode.apply(null, imageBytes));

          setProfileImage(imageDataURL);
        } else {
          setProfileImage("/profile/default.png");
        }
      })
      .catch((error) => {
        console.log("error in updateProfileImage");
        console.log(error);
      });
  };

  // 최초 렌더링 시에도 프로필 이미지 받아오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      updateProfileImage();
    }
  }, []);

  return (
    <div>
      <div className="DEFAULT_IMGBOX" onClick={openModal}>
        <img
          className={`DEFAULT_IMG ${
            profileImage === "/profile/default.png"
              ? "default-image"
              : "received-image"
          }`}
          src={profileImage}
          alt="image"
        />
      </div>
      <div className="USERNAME">{props.userName}님</div>

      <img
        className="SETTING"
        src={`${imageFolder}/setting.png`}
        alt="Setting"
      />
      <img className="ALERT" src={`${imageFolder}/alert.png`} alt="Alert" />

      <Modal isOpen={isModalOpen} className="modal-container">
        <ImageSelection
          closeModal={closeModal}
          setProfileImage={setProfileImage}
        />
      </Modal>
    </div>
  );
}

export default ProfileBox;
