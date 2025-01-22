import React, { useState } from "react";
import { Button, Input, Form, Typography, Select } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../Login/login.css";
import { Link, useNavigate } from "react-router-dom";
const { Title } = Typography;

function StoreInfo({ email, setEmail, password, setPassword, onSignUp }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/login`);
  };

  const handleSignUpFinish = async () => {
    // Trigger the sign-up process
    // const success = await onSignUp();
    // if (success) {
    // If sign-up is successful, navigate to login page
    navigate(`/login`);
    // }
  };
  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Store Infomation
        </Title>
        <Form layout="vertical" onFinish={handleSignUpFinish}>
          {/* Store Name */}
          <Form.Item label="Store Name" name="name">
            <Input
              prefix={<UserOutlined />}
              placeholder="Optical Complex"
              type="name"
              // value={name}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {/*  */}
          <Form.Item label="Store Type" name="type">
            <Select
              // style={{ width: 120 }}
              placeholder="Enter Store Type"
              options={[
                { value: "Retail", label: "Retail" },
                { value: "Wholesale", label: "Wholesale" },
                { value: "Retail & Wholesale", label: "Retail & Wholesale" },
              ]}
            />
          </Form.Item>

          {/* Next to store  */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              block
              onClick={handleLogin}
            >
              Next
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="signup-footer">
          {/* <span onClick={handleLogin}>
            <Link>Login</Link>
          </span> */}
        </div>
      </div>
    </div>
  );
}

export default StoreInfo;
