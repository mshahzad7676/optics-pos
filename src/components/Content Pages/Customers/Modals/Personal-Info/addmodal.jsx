import React, { useContext } from "react";
import { Modal, Form, Input, Row, Col, Select } from "antd";
import CustomerAPI from "../../../../../api/CustomerApi";
import { AppContext } from "../../../../SideNav";

function AddCustomer({ open, onModalClose, setFormData }) {
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);

  // console.log(store, "in modal");

  const closeModal = () => {
    form.resetFields();
    onModalClose();
  };

  const handleFormSubmit = () => {
    form.validateFields().then(async (values) => {
      // setFormData(values);
      const customerData = { ...values, s_id: store.s_id };
      console.log(customerData, "submit");
      await CustomerAPI.createCustomer(customerData);
      // onOk();
      // form.resetFields();
      closeModal();
    });
  };

  return (
    <>
      <Modal
        title="Add Customer"
        open={open}
        // onOk={handleFormSubmit}
        onOk={() => form.submit()}
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
                  { required: true, message: "Please enter the email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer of"
                name="store"
                rules={[{ required: true, message: "Please Select Store" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Store Type"
                  optionFilterProp="label"
                  options={[
                    { value: "Retail", label: "Retail" },
                    { value: "Whole Sale", label: "Whole Sale" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="City" name="city">
                <Input placeholder="Enter City" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddCustomer;
