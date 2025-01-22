import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col } from "antd";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";

function InventoryEditModal({ itemData, open, onModalClose, store }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (itemData) {
      form.setFieldsValue({
        held_quantity: itemData.held_quantity,
      });
    } else {
      form.resetFields();
    }
  }, [itemData, form]);

  const handleUpdateQuantity = async (values) => {
    const updatedQuantity = {
      id: itemData?.id || null,
      held_quantity: values.held_quantity,
    };

    try {
      const response = await AdditemDetail.updateItemQuantity(updatedQuantity);
      if (response) {
        onModalClose();
        form.resetFields();
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  return (
    <Modal
      title="Update Quantity"
      open={open}
      onOk={() => form.submit()}
      onCancel={onModalClose}
      okText="Update"
    >
      <Form
        onFinish={handleUpdateQuantity}
        form={form}
        layout="vertical"
        style={{ padding: "20px" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Quantity"
              name="held_quantity"
              rules={[
                {
                  required: true,
                  message: "Please enter the quantity",
                },
              ]}
            >
              <Input
                type="number"
                step={0.5}
                placeholder="Enter Quantity"
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default InventoryEditModal;
