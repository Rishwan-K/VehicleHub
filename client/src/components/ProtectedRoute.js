import React, { useEffect } from "react";
import { GetCurrentUser } from "../api/users";
import { SetUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import {
  HomeOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  MessageOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const getValidUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      if (response?.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response?.message || "Session expired");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      localStorage.removeItem("token");
      dispatch(SetUser(null));
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getValidUser();
    else navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (adminOnly && user && user.role !== "admin") {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <h2 className="vh-heading">Access denied</h2>
        <p style={{ color: "var(--vh-muted)" }}>This area is for admins only.</p>
      </div>
    );
  }

  const handleMenuClick = ({ key }) => {
    if (key === "home") navigate("/home");
    if (key === "post-ad") navigate("/post-ad");
    if (key === "my-listings") navigate("/my-listings");
    if (key === "chats") navigate("/chats");
    if (key === "profile") navigate("/profile");
    if (key === "admin") navigate("/admin");
    if (key === "logout") {
      localStorage.removeItem("token");
      dispatch(SetUser(null));
      navigate("/login");
    }
  };

  const pathToKey = {
    "/home": "home",
    "/post-ad": "post-ad",
    "/my-listings": "my-listings",
    "/chats": "chats",
    "/profile": "profile",
    "/admin": "admin",
  };
  const selectedKey = pathToKey[location.pathname];

  const navItems = [
    { key: "home", label: "Browse", icon: <HomeOutlined /> },
    { key: "post-ad", label: "Post an Ad", icon: <PlusCircleOutlined /> },
    { key: "my-listings", label: "My Listings", icon: <ProfileOutlined /> },
    { key: "chats", label: "Chats", icon: <MessageOutlined /> },
    { key: "profile", label: "Profile", icon: <UserOutlined /> },
    ...(user?.role === "admin" ? [{ key: "admin", label: "Admin", icon: <DashboardOutlined /> }] : []),
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];

  const { Header, Footer } = Layout;

  return (
    user && (
      <Layout className="app-layout" style={{ minHeight: "100vh" }}>
        <Header className="app-header" style={{ display: "flex", alignItems: "center" }}>
          <div className="app-logo" onClick={() => navigate("/home")}>
            <span className="app-logo-mark">V</span>
            <span className="app-logo-text">VehicleHub</span>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={navItems}
            selectedKeys={selectedKey ? [selectedKey] : []}
            onClick={handleMenuClick}
            style={{ flex: 1, minWidth: 0, background: "transparent", borderBottom: "none" }}
          />
        </Header>

        <div className="app-content">{children}</div>

        <Footer className="app-footer">© 2026 VehicleHub — buy and sell vehicles directly</Footer>
      </Layout>
    )
  );
};

export default ProtectedRoute;
