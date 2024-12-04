import React, { useContext, useState, useEffect } from "react";
import { Button, Input, Form, Typography } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import "../Login/login.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../components/SideNav";
import UserApi from "../../api/UserApi";
const { Title } = Typography;

function Profile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);
  // console.log(user, "Profile");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        name: user?.user_metadata?.name || "",
      });
    }
  }, [user, form]);

  const handleUpdate = async (values) => {
    try {
      const updatedData = {
        name: values.name,
        // phone: values.phoneno,
      };

      const updatedUser = await UserApi.updateUserProfile(updatedData);
      console.log("Updated User:", updatedUser);

      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      console.log("Failed to update profile.");
    }
  };

  return (
    <div className="container1">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Update Profile
        </Title>
        {/* <Form layout="vertical" onFinish={handleSignUpFinish}> */}
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          {/* Name */}
          <Form.Item label="Name" name="name">
            <Input
              prefix={<UserOutlined />}
              type="text"
              placeholder="Shahzad"
              // value={name}
              // onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          {/* Email */}
          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} type="email" readOnly />
          </Form.Item>
          {/* Phone No */}
          {/* <Form.Item label="Phone No" name="phoneno">
            <Input
              prefix={<PhoneOutlined />}
              type="tel"
              placeholder="03··········"
              // maxLength={11}
              // value={phoneno}
              // onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item> */}

          {/* Update Button */}
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
      </div>
    </div>
  );
}

export default Profile;
