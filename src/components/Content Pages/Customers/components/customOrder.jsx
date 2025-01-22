import React, { useState } from "react";
import { Form, Col, Input, Select, Row, Typography } from "antd";

import { glassMinusRange } from "../../../../utils/constants";
import SphNumberSelector from "./sphnumlist";
import CylNumberSelector from "./Cylnumlist";
import AddtitionNumList from "./Additionnumlist";

function CustomOrder({ form, key, onFinish, name }) {
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
        {/* Glass Type */}
        <Col span={6}>
          <Form.Item
            label="Lense Type"
            name={[name, "custom", "type"]}
            rules={[{ required: true, message: "Please Select Lense Type" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select Lense Type"
              optionFilterProp="label"
              options={[
                { value: "Lab HC KT", label: "Lab HC KT" },
                { value: "Lab BC KT", label: "Lab BC KT" },
                { value: "Lab MC PG D", label: "Lab MC P.Gray D" },
                { value: "KK WT KT", label: "KK WT KT" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* Right Eye */}
        <Typography.Title
          level={4}
          style={{
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Right Eye
        </Typography.Title>
        <Row gutter={16}>
          {/* Sph */}
          <Col span={4}>
            <Form.Item
              label="Sph"
              name={[name, "custom", "right", "sph"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Sph"
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <SphNumberSelector></SphNumberSelector>
            </Form.Item>
          </Col>

          {/* Cyl */}
          <Col span={4}>
            <Form.Item
              label="Cyl"
              name={[name, "custom", "right", "cyl"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Lense No."
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <CylNumberSelector></CylNumberSelector>
            </Form.Item>
          </Col>
          {/* Addition */}
          <Col span={4}>
            <Form.Item
              label="Add"
              name={[name, "custom", "right", "addition"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Addition"
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <AddtitionNumList></AddtitionNumList>
            </Form.Item>
          </Col>

          {/* Lense Quantity */}
          <Col span={4}>
            <Form.Item
              label="Quantity"
              name={[name, "custom", "right", "quantity"]}
            >
              <Input
                type="number"
                min={0}
                step={0.5}
                placeholder="3"
                suffix="Pair"
              />
            </Form.Item>
          </Col>

          {/* Lense Price */}
          <Col span={4}>
            <Form.Item label="Price" name={[name, "custom", "right", "price"]}>
              <Input type="number" min={0} placeholder="Rs. 404" />
            </Form.Item>
          </Col>
        </Row>

        {/* Left Eye */}
        <Typography.Title
          level={4}
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginTop: -15,
          }}
        >
          Left Eye
        </Typography.Title>
        <Row gutter={16}>
          {/* Sph */}
          <Col span={4}>
            <Form.Item
              label="Sph"
              name={[name, "custom", "left", "sph"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Sph"
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <SphNumberSelector></SphNumberSelector>
            </Form.Item>
          </Col>

          {/* Cyl */}
          <Col span={4}>
            <Form.Item
              label="Cyl"
              name={[name, "custom", "left", "cyl"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Lense No."
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <CylNumberSelector></CylNumberSelector>
            </Form.Item>
          </Col>
          {/* Addition */}
          <Col span={4}>
            <Form.Item
              label="Add"
              name={[name, "custom", "left", "addition"]}
              // rules={[
              //   { required: true, message: "Please Select the Frame Shape" },
              // ]}
            >
              {/* <Select
                allowClear
                showSearch
                placeholder="Select Addition"
                optionFilterProp="label"
                // options={glassMinusRange}
              /> */}
              <AddtitionNumList></AddtitionNumList>
            </Form.Item>
          </Col>

          {/* Lense Quantity */}
          <Col span={4}>
            <Form.Item
              label="Quantity"
              name={[name, "custom", "left", "quantity"]}
            >
              <Input
                type="number"
                min={0}
                step={0.5}
                placeholder="3"
                suffix="Pair"
              />
            </Form.Item>
          </Col>

          {/* Lense Price */}
          <Col span={4}>
            <Form.Item label="Price" name={[name, "custom", "left", "price"]}>
              <Input type="number" min={0} placeholder="Rs. 404" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CustomOrder;
