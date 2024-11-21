import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { logoSmall } from "./assets";
import { Home, CreatePost, Login, Signup } from "./page";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 관리

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logoSmall} alt="logo" className="w-20 object-contain" />
        </Link>
        <Link to="/">
          <div className="font-bold text-3xl">나키우기</div>
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="text-gray-700 font-medium">
              {userInfo?.ID ? `${userInfo.ID}님` : "사용자님"}
            </div>
            <button
              onClick={handleLogout}
              className="font-inter font-medium bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-inter font-medium bg-[#C5D887] hover:bg-[#FFD66C] shadow-md text-white px-4 py-2 rounded-md hover:shadow-inner"
          >
            로그인
          </Link>
        )}
      </header>

      <main className="sm:p-8 px-4 py-8 w-full bg-[#F6F8F0] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home userInfo={userInfo} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/create-post"
            element={
              isLoggedIn ? <CreatePost /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      로그인 상태
                    </h2>
                    <p className="text-lg font-medium text-gray-700">
                      닉네임: {userInfo?.nickname}
                    </p>
                    <p className="text-sm text-gray-600">
                      이메일: {userInfo?.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setUserInfo={setUserInfo}
                />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
