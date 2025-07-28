import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Home from './pages/home_tap/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />         {/* 첫 페이지 */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
