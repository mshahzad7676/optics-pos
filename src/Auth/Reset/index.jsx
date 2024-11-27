import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";  

const { Title } = Typography;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    const { data, error } = await AuthApi.sendResetLink(email);
    setLoading(false);

    if (error) {
      message.error("Failed to send reset link. Please try again.");
    } else {
      message.success("Reset link sent! Check your email.");
      navigate("/login");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="screen-1">
        {/* Title */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Reset Password
        </Title>

        {/* Form */}
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Email Input */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-btn"
              block
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="footer">
          <span onClick={handleBackToLogin}>
            <a>Back to Login</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
