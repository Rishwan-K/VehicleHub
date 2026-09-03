import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ForgotPassword } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import AuthLayout from "../../components/AuthLayout";

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
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password? It happens."
      subtitle="We'll email you a one-time code so you can set a new password in under a minute."
    >
      <h2 className="vh-heading" style={{ fontSize: 24, marginBottom: 4 }}>
        Reset your password
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        Enter your account email and we'll send a one-time code.
      </p>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Send OTP
        </Button>
      </Form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
