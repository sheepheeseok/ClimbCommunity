import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Home from './pages/home_tap/Home'
import Header from './components/Header';
import NavBar from './components/NavBar';
import SignUp from './pages/Sign_up';
import Login from './pages/login';
import ResetPassword from './pages/ResetPassword';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />         {/* 첫 페이지 */}
            <Route path="/signup" element={<SignUp />} /> {/* 회원가입 페이지 */}
            <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
            <Route path="/reset-pw" element={<ResetPassword />} /> {/* 로그인 페이지 */}
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
