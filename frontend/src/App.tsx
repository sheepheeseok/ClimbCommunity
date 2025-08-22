import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import { useMediaQuery } from "react-responsive";
import './App.css'
import Home from './pages/home_tap/Home'
import Header from "@/components/Header";
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';
import Login from './pages/auth/Login';
import Navbar from './components/Navbar';
import MyPage from './pages/my_tap/MyPage';
import Community from './pages/community_tap/Community';

function App() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <BrowserRouter>
        {isMobile && <Header />}
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-start">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-pw" element={<ResetPassword />} />
            <Route path="/community" element={<Community/>} />

          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
