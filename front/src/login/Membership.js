import React, { useState } from "react";
import "../Fonts/Font.css";
import axios from "axios";
import "./Main.css";

var url = "http://localhost:8080";

// 이메일 인증 모달
function Modal({ closeModal, onModalSubmit }) {
  const onSubmit = () => {
    const userInputVerificationCode = document.getElementById(
      "verificationCodeInput"
    ).value;
    onModalSubmit(userInputVerificationCode);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>이메일 인증</h2>
        <input
          type="text"
          id="verificationCodeInput"
          placeholder="인증코드 입력"
        />
        <button className="verifyButton" onClick={onSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

function Membersip() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [idNotice, setIdNotice] = useState(null);
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [verity, setVerify] = useState(null);
  const [notice, setNotice] = useState(null);

  const [confirmId, setConfirmId] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const onSubmitHanlder = (e) => {
    e.preventDefault();

    if (!id) {
      alert("아이디를 입력하세요.");
      return;
    } else if (!email) {
      alert("이메일을 입력하세요.");
      return;
    } else if (!phone) {
      alert("전화번호를 입력하세요.");
      return;
    } else if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    } else if (password !== checkPassword) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 아이디 중복 체크

    axios
      .post(`${url}/api/userIdExists`, null, {
        params: {
          user_id: id,
        },
      })
      .then((response) => {
        setConfirmId(true);

        axios
          .post(`${url}/api/emailVerify`, null, {
            params: {
              email: email,
            },
          })
          .then((response) => {
            alert("인증번호가 메일로 전송되었습니다.");
            setVerificationCode(response.data);
            setShowModal(true);
          })
          .catch((error) => {
            console.log(error);
            alert("사용 불가능한 이메일 입니다.");
            setConfirmEmail(false);
          });
      })
      .catch((error) => {
        console.log(error);
        alert("사용 불가능한 아이디 입니다.");
        setConfirmId(false);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onModalSubmit = (userInputVerificationCode) => {
    if (Number(userInputVerificationCode) === verificationCode) {
      setConfirmEmail(true);

      axios
        .post(`${url}/api/register`, null, {
          params: {
            user_name: name,
            email: email,
            user_id: id,
            password: password,
            phone_num: phone,
          },
        })
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          alert("정보가 올바르지 않습니다.");
        });
    } else {
      alert("인증코드가 올바르지 않습니다.");
    }
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeCheckPassword = (e) => {
    console.log("check password change : ", e.target.value);
    setCheckPassword(e.target.value);

    if (password === e.target.value) {
      setPasswordNotice(<p style={{ color: "blue" }}>비밀번호 일치</p>);
    } else {
      setPasswordNotice(<p style={{ color: "red" }}>비밀번호 불일치</p>);
    }
  };

  return (
    <div className="MEMBERSHIP_CONTAIN">
      <div className="MEMBERSHIP_FORM_WRAPPER">
        <form onSubmit={onSubmitHanlder}>
          <div>
            <div className="MEMBERSHIP_FORM">
              <input
                className="MEMBERSHIP_FORM_R"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                required
              />
              <input
                className="MEMBERSHIP_FORM_R"
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <input
                className="MEMBERSHIP_FORM_R"
                type="text"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="MEMBERSHIP_FORM_R"
                type="tel"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                className="PASSWORD_FORM_R"
                type="password"
                placeholder="비밀번호"
                title="특수문자 포함 6글자 이상 입력하세요."
                value={password}
                onChange={onChangePassword}
                required
              />
              <input
                className="PASSWORD_FORM_R"
                type="password"
                placeholder="비밀번호 확인"
                value={checkPassword}
                onChange={onChangeCheckPassword}
                required
              />
              <div className="PASSWORDSHOW">{passwordNotice}</div>
            </div>
          </div>
          <button
            className="MEMBERSHIP_BUTTON"
            type="submit"
            onClick={onSubmitHanlder}
          >
            회원가입
          </button>
        </form>
      </div>
      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          onModalSubmit={onModalSubmit}
        />
      )}
    </div>
  );
}
export default Membersip;
