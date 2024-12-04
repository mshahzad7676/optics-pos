import React, { useState } from "react";
import { Button, Input, Form, Typography } from "antd";
import { LockOutlined, EyeOutlined } from "@ant-design/icons";
import "../Login/login.css";
import { Link, useNavigate } from "react-router-dom";
const { Title } = Typography;

function Setting({ onSignUp, password, setPassword }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate(`/login`);
  };

  const handleSignUpFinish = async () => {
    // Trigger the sign-up process
    // const success = await onSignUp();
    // if (success) {
    //   navigate(`/login`);
    // }
  };
  return (
    <div className="container1">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Reset Password
        </Title>
        <Form layout="vertical" onFinish={handleSignUpFinish}>
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
              Update
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

export default Setting;
