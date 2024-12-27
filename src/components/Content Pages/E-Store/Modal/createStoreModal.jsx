import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, Select } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { AppContext } from "../../../SideNav";
import MemberApi from "../../../../api/Member/MemberApi";
import StoreApi from "../../../../api/StoreApi";

function CreateStore({ open, onModalClose }) {
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);

  const closeModal = () => {
    form.resetFields();
    onModalClose();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const StoreData = { ...values, u_id: user.id };

      const response = await StoreApi.createStore(StoreData);
      if (response.success) {
        console.log("Create Store successfully!");
        closeModal();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Store Creation Failed : ${error.message}`);
    }
  };

  return (
    <>
      <Modal
        title="Create Store"
        open={open}
        onOk={handleFormSubmit}
        onCancel={closeModal}
        okText="Create"
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
                label="Store Name"
                name="name"
                rules={[
                  { required: true, message: "Please Enter the Store Name" },
                ]}
              >
                <Input placeholder="Enter Store  Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User Name"
                name="username"
                rules={[
                  { required: true, message: "Please Enter the Username" },
                ]}
              >
                <Input placeholder="Enter Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please Enter Phone No." }]}
              >
                <Input maxLength={11} placeholder="03---------" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default CreateStore;
