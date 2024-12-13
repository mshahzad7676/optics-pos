import React, { useState } from "react";
import { Button, Input, Form, Typography } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import "../Login/login.css";
import { Link, useNavigate } from "react-router-dom";
const { Title } = Typography;

function SignUp({ email, setEmail, password, setPassword, onSignUp }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate(`/`);
  };

  const handleSignUpFinish = async () => {
    // Trigger the sign-up process
    const { success, data } = await onSignUp();
    if (success) {
      // If sign-up is successful, navigate to login page
      navigate(`/userInfo/${data?.member?.id}`);
    }
  };
  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Sign Up
        </Title>
        <Form layout="vertical" onFinish={handleSignUpFinish}>
          {/* Email */}
          <Form.Item label="Email Address" name="email">
            <Input
              prefix={<MailOutlined />}
              placeholder="Username@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item label="Password" name="password">
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? "text" : "password"}
              placeholder="············"
              maxLength={8}
              suffix={
                <EyeOutlined
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Form.Item>
          {/* Confirm Password */}
          <Form.Item label="Confirm Password" name="confirmpassword">
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? "text" : "password"}
              placeholder="············"
              maxLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                <EyeOutlined
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="signup-footer">
          <span onClick={handleLogin}>
            <Link>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
