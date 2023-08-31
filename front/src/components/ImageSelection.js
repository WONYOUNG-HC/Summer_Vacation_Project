import React, { useState } from "react";
import axios from "axios";
import "../Fonts/Font.css";
import "./ImageSelection.css";

var url = "http://localhost:8080";

function ImageSelection({ closeModal }) {
  const [selectedImage, setSelectedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageSelect = (imageName) => {
    setSelectedImage(imageName);
  };

  const handleSaveImage = async () => {
    if (selectedImage) {
      setIsSaving(true);

      try {
        const token = localStorage.getItem("token");

        const imageBlob = await fetch(`/profile/${selectedImage}`).then((r) =>
          r.blob()
        );

        const formData = new FormData();
        formData.append("image", imageBlob);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Content-Type 설정 추가
          },
        };

        const response = await axios.post(
          `${url}/api/upload-profile-image`, // 이미지 업로드 URL
          formData,
          config
        );

        if (response.status === 200) {
          setSelectedImage(selectedImage); // 이미지 저장 후 상태 업데이트

          closeModal(); // 모달 닫기
        }
      } catch (error) {
        console.log("error in handleSaveImage");
        console.log(error);
      }

      setIsSaving(false);
    }
  };

  // 이미지 나열
  const renderImageGrid = () => {
    const imageGrid = [];
    for (let i = 1; i <= 9; i++) {
      const imageName = `${i}.png`;
      imageGrid.push(
        <div
          key={i}
          className={`image-box ${
            selectedImage === imageName ? "selected" : ""
          }`}
          onClick={() => handleImageSelect(imageName)}
        >
          <img src={`/profile/${imageName}`} alt={`Image ${i}`} />
        </div>
      );
    }
    return imageGrid;
  };

  return (
    <div>
      <div>
        <p className="IMG_MENTION">프로필 선택</p>
      </div>
      <div className="IMG_BOX">
        <div className="image-grid">{renderImageGrid()}</div>
      </div>
      <button
        className="PROFILE_BUTTON"
        onClick={handleSaveImage}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Profile Save"}
      </button>
    </div>
  );
}

export default ImageSelection;
