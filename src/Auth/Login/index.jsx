import React, { useState } from "react";
import { Button, Input, Form, Typography } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import "./login.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

const { Title } = Typography;
const Login = ({ email, setEmail, password, setPassword, onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate(`/signup`);
  };
  const handleForgotPass = () => {
    navigate(`/forgetpassword`);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    if (email === "admin" && password === "admin") {
      onLogin();
      // navigate(`/`);
      navigate(`/memberstore`);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Login
        </Title>
        <Form
          layout="vertical"
          onFinish={() => {
            // e.preventDefault();
            onLogin();
          }}
        >
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
              // onClick={handleSubmit}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="footer">
          <span onClick={handleSignUp}>
            <Link>Sign up</Link>
          </span>
          <span onClick={handleForgotPass}>
            <Link>Forgot Password?</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
