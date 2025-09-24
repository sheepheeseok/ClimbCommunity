import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import SignUp from "@/pages/SignUp";
import FindAccount from "@/pages/FindAccount";
import {Profile} from "@/pages/Profile";
import {SettingsPage} from "@/pages/SettingPage";
import {MessagesPage} from "@/pages/MessagesPage";
import { ChatProvider } from "@/data/ChatContext";

function App() {

    return (
        <BrowserRouter>
            <ChatProvider>
            <Routes>
                <Route path="/" element={<Layout><Home/></Layout>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/findAccount" element={<FindAccount/>} />
                <Route
                    path="/profile"
                    element={
                        <Layout>
                            <Profile /> {/* ✅ useParams 없으므로 useMyProfile() 호출 */}
                        </Layout>
                    }
                />
                <Route
                    path="/:userId/profile"
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />
                <Route path="/profile/settingPage" element={<Layout><SettingsPage/></Layout>}/>
                <Route path="/messages/:roomId" element={<Layout><MessagesPage/></Layout>} />
                <Route path="/chatPage" element={<Layout><MessagesPage/></Layout>}/>
            </Routes>
            </ChatProvider>
        </BrowserRouter>
    );
}

export default App;
