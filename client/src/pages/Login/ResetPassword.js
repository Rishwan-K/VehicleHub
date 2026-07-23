import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ResetPassword } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card title="🚗 VehicleHub — Reset Password" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="otp" label="OTP (check your email)" rules={[{ required: true }]}>
            <Input size="large" maxLength={4} />
          </Form.Item>
          <Form.Item name="password" label="New Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Reset Password
          </Button>
        </Form>
        <p style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/forgot-password">Didn't get a code? Request again</Link>
        </p>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
