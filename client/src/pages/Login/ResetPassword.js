import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ResetPassword } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import AuthLayout from "../../components/AuthLayout";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await ResetPassword(values);
      dispatch(HideLoading());
      if (response?.success) {
        message.success("Password reset! Please log in.");
        navigate("/login");
      } else {
        message.error(response?.message || "Could not reset password");
      }
    } catch (err) {
      dispatch(HideLoading());
      message.error(err.message);
    }
  };

  return (
    <AuthLayout
      eyebrow="Almost there"
      title="Set a new password."
      subtitle="Enter the code we emailed you along with your new password."
    >
      <h2 className="vh-heading" style={{ fontSize: 24, marginBottom: 24 }}>
        Enter code &amp; new password
      </h2>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="otp" label="OTP (check your email)" rules={[{ required: true }]}>
          <Input size="large" maxLength={4} placeholder="4-digit code" />
        </Form.Item>
        <Form.Item name="password" label="New password" rules={[{ required: true, min: 6 }]}>
          <Input.Password size="large" placeholder="At least 6 characters" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Confirm new password" rules={[{ required: true }]}>
          <Input.Password size="large" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Reset password
        </Button>
      </Form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        <Link to="/forgot-password">Didn't get a code? Request again</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
