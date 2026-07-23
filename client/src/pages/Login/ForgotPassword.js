import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ForgotPassword } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await ForgotPassword(values.email);
      dispatch(HideLoading());
      if (response?.success) {
        message.success("OTP sent! Check your email.");
        navigate("/reset-password");
      } else {
        message.error(response?.message || "Could not send OTP");
      }
    } catch (err) {
      dispatch(HideLoading());
      message.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card title="🚗 VehicleHub — Forgot Password" style={{ width: 380 }}>
        <p style={{ color: "#888", marginBottom: 16 }}>
          Enter your account email and we'll send you a one-time code to reset your password.
        </p>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Send OTP
          </Button>
        </Form>
        <p style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/login">Back to login</Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
