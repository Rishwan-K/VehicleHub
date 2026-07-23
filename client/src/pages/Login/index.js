import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await LoginUser(values);
      dispatch(HideLoading());
      if (response?.success) {
        localStorage.setItem("token", response.data);
        message.success("Logged in!");
        navigate("/home");
      } else {
        message.error(response?.message || "Login failed");
      }
    } catch (err) {
      dispatch(HideLoading());
      message.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card title="🚗 VehicleHub — Login" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <Button type="primary" htmlType="submit" block size="large">
            Login
          </Button>
        </Form>
        <p style={{ marginTop: 16, textAlign: "center" }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
