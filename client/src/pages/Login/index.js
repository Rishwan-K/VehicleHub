import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import AuthLayout from "../../components/AuthLayout";

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
    <AuthLayout
      eyebrow="Welcome back"
      title="Pick up right where you left off."
      subtitle="Log in to message sellers, manage your listings, and track your saved searches."
    >
      <h2 className="vh-heading" style={{ fontSize: 24, marginBottom: 4 }}>
        Log in
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        New to VehicleHub? <Link to="/register">Create an account</Link>
      </p>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
        <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
          <Link to="/forgot-password" style={{ fontSize: 13 }}>
            Forgot password?
          </Link>
        </div>
        <Button type="primary" htmlType="submit" block size="large">
          Log in
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Login;
