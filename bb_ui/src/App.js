import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ConfigProvider, Layout } from 'antd';
import { AuthContext } from "./context/authContext";
import { useContext } from "react";

import { Homepage } from "./pages/Homepage/Homepage";

import { Login } from "./pages/User/Login";
import { Register } from "./pages/User/Register";

import { NavBar } from './components/Layout/NavBar';
import { Footer } from './components/Layout/Footer';

import { PageErrorServer, PageForbidden, PageNotFound } from "./components/ErrorResult/ErrorResult";

import "./App.scss";
import { Circle } from "./pages/Circle/Circle";


function App() {
    const { Content } = Layout;

    const { currentUser } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        const currRoute = window.location.pathname;
        if (!currentUser) {
            return <Navigate to={currRoute === '/' ? '/login' : `/login?next=${currRoute}`} />
        }
        return children;
    }

    const LoggedInRoute = ({ children }) => {
        const nextLoc = window.location.search ? window.location.search.split('?next=')[1] : '/';
        if (currentUser) {
            return <Navigate to={nextLoc} />
        }
        return children;
    }

    const AppLayout = () => {
        return (
                <Layout className="site-layout dashboard-content" style={{ minHeight: '100vh' }}>
                    <NavBar />
                    <Content style={{ margin: '0 4vb' }}>
                        <div style={{
                            padding: "4vb",
                            minHeight: 360,
                        }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer />
                </Layout>
        );
    }

    return (
        <div className="App">
            <ConfigProvider theme={{
                token: {
                    colorBgLayout: '#D9D9D9',
                    colorText: '#373425',
                    colorPrimary: '#3B9FF7'
                },
            }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                            <Route path="" element={<Homepage />} />
                            <Route path="/circle" element={<Circle />} />
                            {/* <Route path="my-profile" element={<MyProfile />}></Route> */}
                        </Route>
                        <Route path="/login" element={<LoggedInRoute><Login /></LoggedInRoute>}></Route>
                        <Route path="/register" element={<LoggedInRoute><Register /></LoggedInRoute>}></Route>
                        
                        <Route path="error">
                            <Route path="403" element={<PageForbidden />} />
                            <Route path="404" element={<PageNotFound />} />
                            <Route path="500" element={<PageErrorServer />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>

        </div>
    );
}

export default App;
