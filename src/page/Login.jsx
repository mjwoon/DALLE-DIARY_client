import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const Login = ({ setIsLoggedIn, setUserInfo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOSTING}/login/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      // 로그인 성공
      setIsLoggedIn(true);
      setUserInfo(response.data.user); // 사용자 정보 저장
      navigate("/"); // 홈으로 이동
    } catch (error) {
      setError(
        error.response?.data?.message || "사용자 정보가 올바르지 않습니"
      );
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">로그인</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="example@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              autocomplete="off"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
         rounded-lg focus:ring-[#C5D887] focus:border-[#C5D887] outline-none block w-full p-3"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full font-inter font-bold bg-[#C5D887] hover:bg-[#FFD66C] shadow-md text-white px-4 py-2 rounded-md hover:shadow-inner"
          >
            로그인
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
