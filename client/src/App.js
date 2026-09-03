import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VehicleDetail from "./pages/VehicleDetail";
import PostAd from "./pages/PostAd";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

const theme = {
  token: {
    colorPrimary: "#E8963A",
    colorLink: "#E8963A",
    colorLinkHover: "#C97C22",
    colorText: "#16212B",
    colorTextSecondary: "#62717F",
    colorBorder: "#E1E6EA",
    colorBgLayout: "#F4F6F8",
    colorSuccess: "#1E8E5A",
    colorError: "#D64545",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Layout: {
      headerBg: "#0B1F35",
      bodyBg: "#F4F6F8",
      footerBg: "#0B1F35",
    },
    Menu: {
      darkItemBg: "#0B1F35",
      darkItemSelectedBg: "transparent",
      darkItemColor: "#C9D3DC",
      darkItemHoverColor: "#FFFFFF",
      darkItemSelectedColor: "#E8963A",
    },
    Card: {
      borderRadiusLG: 10,
    },
    Button: {
      fontWeight: 600,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicle/:id"
              element={
                <ProtectedRoute>
                  <VehicleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-ad"
              element={
                <ProtectedRoute>
                  <PostAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-listing/:id"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
