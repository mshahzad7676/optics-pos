import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col } from "antd";
import GlassTypeApi from "../../../../../../api/Glasses Inventory/GlassTypeApi";

function AddGlassTypeModal({ itemData, open, onModalClose, store }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (itemData) {
      form.setFieldsValue(itemData);
    } else {
      form.resetFields();
    }
  }, [itemData, form]);

  const handleAdditem = async (values) => {
    const itemPayload = {
      id: itemData?.id || null,
      name: values.name,
      s_id: store?.s_id,
    };

    try {
      const response = await GlassTypeApi.addGlassType(itemPayload);
      const { data } = response;

      form.resetFields();
      onModalClose();

      console.log("Item added:", data);
    } catch (err) {
      console.log("Error in Adding Item");
    }
  };

  return (
    <>
      <Modal
        title={itemData ? "Update Type" : "Add Type"}
        open={open}
        // onOk={onModalClose}
        onOk={() => form.submit()}
        onCancel={onModalClose}
      >
        <Form
          onFinish={handleAdditem}
          form={form}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Item Name" name="name">
                <Input
                  showSearch
                  placeholder="Enter Item Name"
                  // rules={[
                  //     {
                  //       required: true,
                  //       message: "Please Enter the Item Name",
                  //     },
                  //   ]}
                  style={{
                    fontSize: "14px",
                    width: 210,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddGlassTypeModal;
