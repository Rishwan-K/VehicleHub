import React, { useEffect } from "react";
import { GetCurrentUser } from "../api/users";
import { SetUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    return <h2 style={{ padding: 20 }}>Access Denied</h2>;
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
          <div
            className="logo"
            onClick={() => navigate("/home")}
            style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginRight: 24, cursor: "pointer" }}
          >
            🚗 VehicleHub
          </div>
          <Menu theme="dark" mode="horizontal" items={navItems} onClick={handleMenuClick} style={{ flex: 1 }} />
        </Header>

        <div className="app-content">{children}</div>

        <Footer style={{ textAlign: "center" }}>© 2026 VehicleHub Powered By Rahman Traders</Footer>
      </Layout>
    )
  );
};

export default ProtectedRoute;
