import React from "react";
import { Row, Typography, Card, Col, Space } from "antd";
import { FundTwoTone, DollarTwoTone, ShopTwoTone } from "@ant-design/icons";
import Orders from "./Components/Orders";
const { Text } = Typography;

function Sales() {
  return (
    <>
      <Typography.Title
        level={4}
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Sales
      </Typography.Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card
            title={
              <span>
                <FundTwoTone
                  twoToneColor="#52c41a"
                  style={{ marginRight: 8 }}
                />
                Sales Statistics
              </span>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
          >
            <Space direction="vertical" size={0}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 25,
                }}
              >
                Rs. 6,32,474
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 12,
                  color: "#8c9097",
                }}
              >
                THIS MONTH
              </Text>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              <span>
                <DollarTwoTone
                  twoToneColor="#52c41a"
                  style={{ marginRight: 8 }}
                />
                Total Revenue
              </span>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
          >
            <Space direction="vertical" size={0}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 25,
                }}
              >
                Rs. 4,32,474
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 12,
                  color: "#8c9097",
                }}
              >
                THIS MONTH
              </Text>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              <span>
                <ShopTwoTone
                  twoToneColor="#52c41a"
                  style={{ marginRight: 8 }}
                />
                Total Order
              </span>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
          >
            <Space direction="vertical" size={0}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 25,
                }}
              >
                110
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 12,
                  color: "#8c9097",
                }}
              >
                THIS MONTH
              </Text>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              <span>
                <ShopTwoTone
                  twoToneColor="#52c41a"
                  style={{ marginRight: 8 }}
                />
                Total Order
              </span>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
          >
            <Space direction="vertical" size={0}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 25,
                }}
              >
                45
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 12,
                  color: "#8c9097",
                }}
              >
                THIS WEEK
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
      <Orders></Orders>
    </>
  );
}

export default Sales;
