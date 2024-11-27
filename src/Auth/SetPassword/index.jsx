import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";


const { Title } = Typography;

const SetNewPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    const { data, error } = await AuthApi.updatePassword(newPassword);

    if (error) {
      message.error(error.message || "Failed to update password. Please try again.");
    } else {
      message.success("Password updated successfully!");
      navigate("/login"); // Redirect to login page
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="screen-1">
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Set New Password
        </Title>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          {/* New Password */}
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
          </Form.Item>

          {/* Update Password Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPassword;
