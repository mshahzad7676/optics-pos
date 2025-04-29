import React, { useEffect, useState } from "react";
import { Form, Col, Input, Select, Row, InputNumber } from "antd";
import Prescription from "./prescription";

function ContactLenseInfo({ form, key, onFinish, name }) {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isMobileView ? (
        <>
          <Row gutter={12} style={{ padding: "0px 10px" }}>
            {/* Lense Type */}
            <Col span={12}>
              <Form.Item
                label="Lens Category"
                name={[name, "contactLense", "category"]}
                // rules={[
                //   { required: true, message: "Please Select Lense Category" },
                // ]}
              >
                <Select
                  showSearch
                  placeholder="Select Category"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").localeCompare(optionB?.label ?? "")
                  }
                  options={[
                    { value: "One Day", label: "One Day" },
                    { value: "Toric Transparent", label: "Toric Transparent" },
                    { value: "Toric Color", label: "Toric Color" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Lense Brand */}
            <Col span={12}>
              <Form.Item
                label="Lense Brand"
                name={[name, "contactLense", "brand"]}
                // rules={[
                //   { required: true, message: "Please Select Lense Brand" },
                // ]}
              >
                <Select
                  showSearch
                  placeholder="Select Brand"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").localeCompare(optionB?.label ?? "")
                  }
                  options={[
                    { value: "Clear Vision", label: "Clear Vision" },
                    { value: "Optimax", label: "Optimax" },
                    { value: "Soft Eye", label: "Soft Eye" },
                    { value: "Optiano", label: "Optiano" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Quantity" name={[name, "contactLense", "qty"]}>
                <InputNumber
                  step={0.5}
                  type="number"
                  placeholder="Enter Quantity"
                  style={{ width: "100%" }}
                  suffix="Pair"
                  min={0}
                />
              </Form.Item>
            </Col>

            {/* Lense Price */}
            <Col span={12}>
              <Form.Item
                label="Lense Price"
                name={[name, "contactLense", "price"]}
                rules={[
                  { required: true, message: "Please Enter Lense Price" },
                ]}
              >
                <Input placeholder="Rs. 404" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          {/* Lense Comments */}
          <Col span={24}>
            <Form.Item
              label="Comments"
              name={[name, "contactLense", "comment"]}
            >
              <Input
                placeholder="Brand Name, Job No."
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {/* Prescription Component */}
          <Prescription form={form} name={name} />
        </>
      ) : (
        <>
          <Row gutter={12} style={{ padding: "0px 10px" }}>
            {/* Lense Type */}
            <Col span={4}>
              <Form.Item
                label="Lens Category"
                name={[name, "contactLense", "category"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
                // rules={[
                //   { required: true, message: "Please Select Lense Category" },
                // ]}
              >
                <Select
                  showSearch
                  placeholder="Select Category"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").localeCompare(optionB?.label ?? "")
                  }
                  options={[
                    { value: "One Day", label: "One Day" },
                    { value: "Toric Transparent", label: "Toric Transparent" },
                    { value: "Toric Color", label: "Toric Color" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Lense Brand */}
            <Col span={4}>
              <Form.Item
                label="Lense Brand"
                name={[name, "contactLense", "brand"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
                // rules={[
                //   { required: true, message: "Please Select Lense Brand" },
                // ]}
              >
                <Select
                  showSearch
                  placeholder="Select Brand"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").localeCompare(optionB?.label ?? "")
                  }
                  options={[
                    { value: "Clear Vision", label: "Clear Vision" },
                    { value: "Optimax", label: "Optimax" },
                    { value: "Soft Eye", label: "Soft Eye" },
                    { value: "Optiano", label: "Optiano" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Lense Comments */}
            <Col span={5}>
              <Form.Item
                label="Comments"
                name={[name, "contactLense", "comment"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
              >
                <Input placeholder="Job No." style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            {/* Quantity */}
            <Col span={4}>
              <Form.Item
                label="Quantity"
                name={[name, "contactLense", "qty"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
              >
                <InputNumber
                  step={0.5}
                  type="number"
                  placeholder="Enter Quantity"
                  style={{ width: "100%" }}
                  suffix="Pair"
                  min={0}
                />
              </Form.Item>
            </Col>

            {/* Lense Price */}
            <Col span={6}>
              <Form.Item
                label="Lense Price"
                name={[name, "contactLense", "price"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
                rules={[
                  { required: true, message: "Please Enter Lense Price" },
                ]}
              >
                <Input placeholder="Rs. 404" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          {/* Prescription Component */}
          <Prescription form={form} name={name} />
        </>
      )}
    </>
  );
}

export default ContactLenseInfo;
