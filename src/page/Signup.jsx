import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");

  // 이메일 중복 확인
  const checkEmailAvailability = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOSTING}/login/check-email`,
        { email },
        {
          withCredentials: true,
        }
      );
      const { available, message } = response.data;
      setEmailCheckMessage(message);
    } catch (error) {
      setEmailCheckMessage("서버 오류로 이메일 확인에 실패했습니다.");
    }
  };

  // 회원가입 요청
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!nickname || !email || !password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
         `${process.env.REACT_APP_HOSTING}/login/register`,
        {
          nickname,
          email,
          password,
        },
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message || "서버 오류로 회원가입에 실패했습니다."
      );
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          회원가입
        </h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <input
              autocomplete="off"
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              autocomplete="off"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checkEmailAvailability} // 포커스가 벗어날 때 이메일 중복 확인
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="example@example.com"
            />
            {emailCheckMessage && (
              <p
                className={`mt-2 text-sm ${
                  emailCheckMessage.includes("사용 가능")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {emailCheckMessage}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-400"
          >
            회원가입
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
