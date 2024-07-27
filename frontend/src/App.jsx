import { Box, Button, Container } from "@chakra-ui/react"
import UserPage from "./Pages/userPage";
import PostPage from "./Pages/postPage";
import Header from "./Components/Header";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/homePage";
import AuthPage from "./Pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import CreatePost from "./Components/CreatePost";
import ChatPage from "./Pages/ChatPage";
import { SettingsPage } from "./Pages/SettingsPage";
import SellProduct from "./Components/SellProduct";

function App() {
    const user = useRecoilValue(userAtom);
    const { pathname } = useLocation();

    return (
        <Box position={"relative"} w='full'>
            <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
                <Header />
                <Routes>
                    <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
                    <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
                    <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

                    <Route
                        path='/:username'
                        element={
                            user ? (
                                <>
                                    <UserPage />
                                    <SellProduct/>
                                    <CreatePost />
                                </>
                            ) : (
                                <UserPage />
                            )
                        }
                    />
                    <Route path='/:username/post/:pid' element={<PostPage />} />
                    <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
                    <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
                </Routes>
            </Container>
        </Box>
    );
}
export default App
