import React, { useState, useEffect } from "react";
import "../Fonts/Font.css";
import "./Main.css";
import Login from "./Login.js";
import Membership from "./Membership.js";
import Layout from "../components/Layout";
import axios from "axios";
import BackgroundComponent from "../BG/BackgroundComponent";

function Main({ handleLogin }) {
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const [isMembershipSelected, setIsMembershipSelected] = useState(false);

  const handleLoginClick = () => {
    setIsLoginSelected(true);
    setIsMembershipSelected(false); // Hide Membership component when Login is selected
  };

  const handleMembershipClick = () => {
    setIsLoginSelected(false);
    setIsMembershipSelected(true); // Show Membership component when Membership is selected
  };

  return (
    <BackgroundComponent>
      <div className="FULL">
        {/* 왼쪽 */}
        <div className="LEFT">
          <div className="Left_Title">
            <div className="MOGGOZI_BACK">
              <p className="MOGGOZI">모꼬지</p>
            </div>
            <div className="MOGGOZI_B_BACK">
              <div className="MOGGOZI_B_WRAP">
                <p className="MOGGOZI_B">우리 언제 만날까?</p>
                <p className="MOGGOZI_B">매번 번거로운 약속 잡기,</p>
                <p className="MOGGOZI_B">친구들과 쉽게 맞지 않는 시간,</p>
                <p className="MOGGOZI_B">
                  달력에 각자의 일정을 올려서 약속을 잡아보자!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="RIGHT">
          <div className="BUTTON">
            <div className="Right">
              <div
                className={isLoginSelected ? "LOGIN selected" : "LOGIN"}
                onClick={handleLoginClick}
              >
                로그인
              </div>
            </div>

            <div className="Left">
              <div
                className={
                  isLoginSelected ? "MEMBERSHIP" : "MEMBERSHIP selected"
                }
                onClick={handleMembershipClick}
              >
                회원가입
              </div>
            </div>
          </div>
          {isLoginSelected && (
            <div className="LoginFormContainer">
              <Login handleLogin={handleLogin} />
            </div>
          )}
          {isMembershipSelected && (
            <div className="MembershipFormContainer">
              <Membership />
            </div>
          )}
        </div>
        {/* 메인화면 이미지 변경 */}
        <img src="/calendar.png" className="MIDIMG" alt="My Image" />
      </div>
    </BackgroundComponent>
  );
}

export default Main;
