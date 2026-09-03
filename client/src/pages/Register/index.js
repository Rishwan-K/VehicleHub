import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser } from "../../api/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import AuthLayout from "../../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await RegisterUser(values);
      dispatch(HideLoading());
      if (response?.success) {
        message.success("Registered! Please login.");
        navigate("/login");
      } else {
        message.error(response?.message || "Registration failed");
      }
    } catch (err) {
      dispatch(HideLoading());
      message.error(err.message);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="List your vehicle in front of real buyers."
      subtitle="Create a free account to post listings, chat with buyers, and build a seller rating."
    >
      <h2 className="vh-heading" style={{ fontSize: 24, marginBottom: 4 }}>
        Create your account
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
          <Input size="large" placeholder="Your name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone (optional)">
          <Input size="large" placeholder="10-digit mobile number" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password size="large" placeholder="At least 6 characters" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 8 }}>
          Create account
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Register;
