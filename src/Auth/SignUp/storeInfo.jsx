import React, { useContext, useState } from "react";
import { Button, Input, Form, Typography, Select } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
  BranchesOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../Login/login.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../components/SideNav";
const { Title } = Typography;

function StoreInfo({ updateStore }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { userId } = useParams();

  // skip to Login
  const handleLogin = () => {
    // navigate(`/`);
    navigate(`/memberstores`);
  };

  const handleSignUpFinish = async () => {
    try {
      const values = await form.validateFields();
      const { success, data } = await updateStore({
        name: values.name,
        city: values.city,
        type: values.type,
        u_id: userId,
      });
      console.log(data, "res");
      if (success) {
        // navigate(`/`);
        navigate(`/memberstores`);
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };
  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Shop Infomation
        </Title>
        {/* <Form layout="vertical" onFinish={handleSignUpFinish}> */}
        <Form layout="vertical" form={form}>
          {/* Store Name */}
          <Form.Item
            label="Shop Name"
            name="name"
            rules={[
              { required: true, message: "Please Enter Your Shop Name!" },
            ]}
          >
            <Input
              prefix={<ShoppingCartOutlined />}
              placeholder="Optical Complex"
              type="text"
              // value={name}
              // onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Place of Shop"
            name="city"
            rules={[
              { required: true, message: "Please Enter Your Shop City!" },
            ]}
          >
            <Input
              prefix={<BranchesOutlined />}
              placeholder="Saddar-Rwp"
              type="text"
              // value={name}
            />
          </Form.Item>

          {/*  */}
          <Form.Item
            label="Shop Type"
            name="type"
            rules={[{ required: true, message: "Please Enter Shop Type!" }]}
          >
            <Select
              // style={{ width: 120 }}
              placeholder="Enter Shop Type"
              // defaultValue={"Retail & Wholesale"}
              options={[
                { value: "Retail", label: "Retail" },
                { value: "Wholesale", label: "Wholesale" },
                { value: "Retail & Wholesale", label: "Retail & Wholesale" },
              ]}
            />
          </Form.Item>

          {/* Next to Login  */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              block
              onClick={handleSignUpFinish}
            >
              Next
            </Button>
          </Form.Item>

          {/* Skip Shop info */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              className="login-btn"
              block
              onClick={handleLogin}
            >
              Skip
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
