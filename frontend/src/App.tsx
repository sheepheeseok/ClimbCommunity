import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Home from './pages/home_tap/Home'
import Header from "@/components/Header";

function App() {

  return (
    <>
      <BrowserRouter>
          <Header />
        <Routes>
          <Route path="/" element={<Home />} />         {/* 첫 페이지 */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
