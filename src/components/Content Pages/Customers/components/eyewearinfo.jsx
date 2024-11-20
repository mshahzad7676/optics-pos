import React from "react";
import { Form, Col, Input, Select, Row } from "antd";
import Prescription from "./prescription";

function EyewearInfo({ form, key, onFinish, name }) {
  return (
    <>
      {/* <Form
        key={key}
        onFinish={onFinish}
        layout="vertical"
        style={{ padding: "0px 20px" }}
        form={form}
      > */}
      <div className="eyewear-info-container" style={{ padding: "0px 10px" }}>
        <Row gutter={16}>
          {/* Frame Type */}
          <Col span={6}>
            <Form.Item
              label="Frame Type"
              name={[name, "frame", "type"]}

              // rules={[
              //   { required: true, message: "Please Select the Frame Type" },
              // ]}
            >
              <Select
                showSearch
                placeholder="Select Frame Type"
                optionFilterProp="label"
                options={[
                  { value: "Full Rim", label: "Full Rim" },
                  { value: "Half Rim", label: "Half Rim" },
                  { value: "Rimless", label: "Rimless" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Frame Shape */}
          <Col span={6}>
            <Form.Item
              label="Frame Shape"
              name={[name, "frame", "shape"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
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
              />
            </Form.Item>
          </Col>

          {/* Frame Comments */}
          <Col span={6}>
            <Form.Item label="Comments" name={[name, "frame", "comment"]}>
              <Input placeholder="Brand Name, Job No." />
            </Form.Item>
          </Col>

          {/* Frame Price */}
          <Col span={6}>
            <Form.Item label="Frame Price" name={[name, "frame", "price"]}>
              <Input type="number" min={0} placeholder="Rs. 404" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Lens Category */}
          <Col span={6}>
            <Form.Item
              label="Lens Category"
              name={[name, "lens", "lcategory"]}
              // rules={[
              //   { required: true, message: "Please Select the Lens Category" },
              // ]}
            >
              <Select
                showSearch
                placeholder="Select Lens Category"
                optionFilterProp="label"
                options={[
                  { value: "Single Vision", label: "Single Vision" },
                  { value: "Bifocal Lens", label: "Bifocal Lens" },
                  { value: "Progressive Lens", label: "Progressive Lens" },
                  { value: "High Index", label: "High Index" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Lens Type */}
          <Col span={6}>
            <Form.Item
              label="Lens Type"
              name={[name, "lens", "type"]}
              // rules={[
              //   { required: true, message: "Please Select the Lens Type" },
              // ]}
            >
              <Select
                showSearch
                placeholder="Select Lens Type"
                optionFilterProp="label"
                options={[
                  { value: "Blue Cut", label: "Blue Cut" },
                  { value: "EyeTech", label: "EyeTech" },
                  { value: "PhotoGrey MC", label: "PhotoGrey MC" },
                  {
                    value: "PG BC (Blue Coating)",
                    label: "PG BC (Blue Coating)",
                  },
                  {
                    value: "PG BC (Green Coating)",
                    label: "PG BC (Green Coating)",
                  },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Lens Comments */}
          <Col span={6}>
            <Form.Item label="Comments" name={[name, "lens", "comment"]}>
              <Input placeholder="Brand Name" />
            </Form.Item>
          </Col>

          {/* Lens Price */}
          <Col span={6}>
            <Form.Item label="Lens Price" name={[name, "lens", "price"]}>
              <Input placeholder="Rs. 404" />
            </Form.Item>
          </Col>
        </Row>
        {/* Prescription Component */}
        <Prescription form={form} name={name} />
      </div>
      {/* </Form> */}
    </>
  );
}

export default EyewearInfo;
