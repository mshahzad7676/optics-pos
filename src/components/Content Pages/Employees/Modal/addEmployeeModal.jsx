import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, Select } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { AppContext } from "../../../SideNav";
import MemberApi from "../../../../api/Member/MemberApi";

function AddEmployee({ open, onModalClose, setFormData, itemData }) {
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const closeModal = () => {
    form.resetFields();
    onModalClose();
  };

  useEffect(() => {
    if (itemData) {
      form.setFieldsValue(itemData);
    } else {
      form.resetFields();
    }
  }, [itemData, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const memberData = { ...values, s_id: store.s_id };

      const response = await MemberApi.CreateMember(memberData);
      if (response.success) {
        console.log("Employee added successfully!");
        closeModal();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Failed to add employee: ${error.message}`);
    }
  };

  return (
    <>
      <Modal
        title={itemData ? "Update Member" : "Add Member"}
        open={open}
        onOk={handleFormSubmit}
        onCancel={closeModal}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please Enter the Name" }]}
              >
                <Input placeholder="Enter Name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please Enter the Phone No." },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input maxLength={11} placeholder="030--------" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  // { required: true, message: "Please enter the email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Username@gmail.com"
                ></Input>
              </Form.Item>
            </Col>

            <Col span={12}>
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
            </Col>

            <Col span={12}>
              <Form.Item label="Role" name="roles">
                <Select
                  style={{ width: 120 }}
                  placeholder="Enter Role"
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Member", label: "Member" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddEmployee;
