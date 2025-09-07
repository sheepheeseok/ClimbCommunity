import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import SignUp from "@/pages/SignUp";
import FindAccount from "@/pages/FindAccount";
import {Profile} from "@/pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home/></Layout>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/findAccount" element={<FindAccount/>} />
                <Route path="/profile" element={<Layout><Profile/></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
