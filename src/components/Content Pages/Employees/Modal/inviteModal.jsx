import React, { useContext } from "react";
import { Modal, Form, Input, Row, Col } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { AppContext } from "../../../SideNav";
import MemberApi from "../../../../api/Member/MemberApi";

function InviteModal({ open, onModalClose }) {
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);

  const closeModal = () => {
    form.resetFields();
    onModalClose();
  };

  const handleFormSubmit = async (values) => {
    try {
      const { email } = values;
      const response = await MemberApi.inviteMember(email);
      if (response.success) {
        console.log("Invited successfully!");
        closeModal();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to invite member: ${error.message}`);
    }
  };

  return (
    <Modal
      title="Invite Member"
      open={open}
      onOk={() => form.submit()}
      onCancel={closeModal}
      okText="Invite"
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ padding: "20px" }}
      >
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Username@gmail.com"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default InviteModal;
