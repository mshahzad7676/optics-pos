import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Upload,
  Button,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UploadInventory from "../../../../../../api/Frame Inventory/UploadInventoryImgApi";

import FrameDetails from "../../../../../../api/Frame Inventory/FrameDetailApi";

function AddFrameModal({ frameData, open, onModalClose, store }) {
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (frameData) {
      form.setFieldsValue(frameData);
    } else {
      form.resetFields();
    }
  }, [frameData, form]);

  const handleUpload = async (frameid) => {
    try {
      // const filePath = `${frameid}-image`;
      const result = await UploadInventory.uploadFrameImg(file, frameid);
      if (result) {
        console.log("Uploaded file URL:", result);
      }
    } catch (err) {
      console.log("Error during upload:", err);
    }
  };

  const handleAddFrame = async (values) => {
    const framePayload = {
      id: frameData?.id || null,
      category: values.category,
      shape: values.shape,
      brand: values.brand,
      quantity: values.quantity,
      price: values.price,
      s_id: store?.s_id,
    };

    try {
      const response = await FrameDetails.addFrame(framePayload);
      const { data } = response;
      // UPLOAD IMAGE USING FRAMEiD
      if (data?.id) {
        await handleUpload(data.id);
      }
      form.resetFields();
      onModalClose();

      console.log("Frame added:", data);
    } catch (err) {
      console.log("Error in Adding Frame");
    }
  };

  return (
    <>
      <Modal
        title={frameData ? "Update Frame" : "Add Frame"}
        open={open}
        onOk={() => form.submit()}
        onCancel={onModalClose}
      >
        <Form
          onFinish={handleAddFrame}
          form={form}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Frame Picture"
                name="pic"
                rules={[
                  {
                    required: true,
                    message: "Please upload the frame picture",
                  },
                ]}
              >
                <Upload
                  beforeUpload={(file) => {
                    setFile(file);
                    return false;
                  }}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Frame Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please Select Frame Category",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Frame Category"
                  optionFilterProp="label"
                  options={[
                    { value: "Female", label: "Female" },
                    { value: "Male", label: "Male" },
                    { value: "Kids", label: "Kids" },
                    { value: "Unisex", label: "Unisex" },
                  ]}
                  style={{
                    fontSize: "14px",
                    width: 210,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Frame Shape"
                name="shape"
                rules={[
                  {
                    required: true,
                    message: "Please Select Frame Shape",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Frame Shape"
                  optionFilterProp="label"
                  options={[
                    { value: "Square", label: "Square" },
                    { value: "Cat Eye", label: "Cat Eye" },
                    { value: "Rectangle", label: "Rectangle" },
                  ]}
                  style={{
                    fontSize: "14px",
                    width: 210,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Brand"
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Please Select Frame Brand",
                  },
                ]}
              >
                <Input placeholder="Enter Brand Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please Select Frame Quantity",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  defaultValue={0}
                  style={{
                    width: 210,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please Select Frame Price",
                  },
                ]}
              >
                <Input type="number" placeholder="Enter Price" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddFrameModal;
