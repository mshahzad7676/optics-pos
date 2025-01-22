import React, { useState, useEffect } from "react";
import { Form, Col, Input, Select, Row, Typography, Button, Flex } from "antd";
import SphNumberSelector from "./sphnumlist";
import CylNumberSelector from "./Cylnumlist";
import AddtitionNumList from "./Additionnumlist";
import { DeleteOutlined } from "@ant-design/icons";
function WholeSaleInputs({ form, key, onFinish, name, glassTypes }) {
  const [selectedLensType, setSelectedLensType] = useState(undefined);

  const handleLensTypeChange = (value) => {
    setSelectedLensType(value);
  };

  useEffect(() => {
    handleLensTypeChange(glassTypes);
  }, [glassTypes]);

  return (
    <>
      <div className="eyewear-info-container" style={{ padding: "0px 10px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            color="danger"
            variant="filled"
            size="middle"
            // onClick={onDelete}
          >
            <DeleteOutlined />
          </Button>
        </Col>

        {/* Lens Type */}
        <Col span={6}>
          <Form.Item
            label="Lens Type"
            name={[name, "glass", "type"]}
            rules={[{ required: true, message: "Please Select Lens Type" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select or Add Lens Type"
              optionFilterProp="label"
              options={glassTypes?.map((type) => ({
                label: type.name,
                value: type.name,
              }))}
            />
          </Form.Item>
        </Col>

        {selectedLensType && (
          <Row gutter={16}>
            {/* Lens Range */}
            {/* <Col span={7}>
              <Form.Item
                label="Lens Range"
                name={[name, "glass", "range"]}
                rules={[
                  { required: true, message: "Please Select Lense Range" },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Lens Range"
                  optionFilterProp="label"
                  options={glassMinusRange}
                  onChange={handleLensRangeChange}
                />
              </Form.Item>
            </Col> */}

            {/* Sph Number */}
            <Col span={4}>
              <Form.Item
                label="Sph"
                name={[name, "glass", "sph"]}
                rules={[{ required: true, message: "Please Select Sph" }]}
              >
                <SphNumberSelector></SphNumberSelector>
              </Form.Item>
            </Col>

            {/* Cyl Number */}
            {/* {cylList.length > 0 && ( */}
            <Col span={4}>
              <Form.Item
                label="Cyl"
                name={[name, "glass", "cyl"]}
                rules={[{ required: true, message: "Please Select Cyl." }]}
              >
                <CylNumberSelector></CylNumberSelector>
              </Form.Item>
            </Col>
            {/* )} */}

            {/* Addition Number */}
            {/* {addList.length > 0 && ( */}
            <Col span={4}>
              <Form.Item
                label="Add"
                name={[name, "glass", "addition"]}
                rules={[{ required: true, message: "Please Select Add." }]}
              >
                <AddtitionNumList></AddtitionNumList>
              </Form.Item>
            </Col>
            {/* )} */}

            {/* Lens Quantity */}
            <Col span={4}>
              <Form.Item
                label="Quantity"
                style={{ marginBottom: 0 }}
                name={[name, "glass", "quantity"]}
                rules={[{ required: true, message: "Please Enter Quantity" }]}
              >
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="3"
                  suffix="Pair"
                  // onChange={handleQuantityChange}
                />
              </Form.Item>
              <Typography.Text style={{ fontSize: "12px" }}>
                <strong>Total Quantity: </strong>
                {/* {itemQuantityMap[
                  `${selectedSph}/${selectedCyl ?? null}/${selectedAdd ?? null}`
                ]?.held_quantity ?? 0} */}
              </Typography.Text>
            </Col>

            {/* Lens Price */}
            <Col span={4}>
              <Form.Item
                label="Price"
                style={{ marginBottom: 0 }}
                name={[name, "glass", "price"]}
              >
                <Input
                  type="number"
                  min={0}
                  // value={itemData?.[0]?.price}
                  placeholder="Rs. 404"
                />
              </Form.Item>
              <Typography.Text style={{ fontSize: "12px" }}>
                <strong>Unit Price: </strong>
                {/* {itemData?.[0]?.price}{" "} */}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}
export default WholeSaleInputs;
