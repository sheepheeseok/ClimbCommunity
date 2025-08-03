import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import { useMediaQuery } from "react-responsive";
import './App.css'
import Home from './pages/home_tap/Home'
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import SignUp from './pages/Sign_up';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';

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
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-pw" element={<ResetPassword />} />
            </Routes>
          </main>
        </BrowserRouter>
      </>
  )
}

export default App
