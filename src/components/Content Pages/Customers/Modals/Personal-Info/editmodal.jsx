import React from "react";
import { Modal, Form, Input, Row, Col } from "antd";
function EditCustomer({ open, onOk, onCancel, customer }) {
  const [form] = Form.useForm();

  // Initialize form fields when customer data changes
  React.useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    }
  }, [customer, form]);

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      onOk({ ...values, id: customer.id }); // Pass the updated customer data back to the parent
    });
  };
  return (
    <>
      <Modal
        title="Update Customer"
        open={open}
        onOk={handleFormSubmit}
        onCancel={onCancel}
      >
        <Form
          onFinish={onOk}
          form={form}
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
                    type: "tel",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Enter Phone No." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                // rules={[
                //   { required: true, message: "Please enter the email" },
                //   {
                //     type: "email",
                //     message: "Please enter a valid email address",
                //   },
                // ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
            <Col span={10}>
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
export default EditCustomer;
