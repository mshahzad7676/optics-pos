import React, { useContext, useEffect, useState } from "react";
import { Row, Typography, Card, Col, Space } from "antd";
import { FundTwoTone, DollarTwoTone, ShopTwoTone } from "@ant-design/icons";
import Orders from "./Components/Orders";
import { CapsuleTabs } from "antd-mobile";
import OrderTableApi from "../../../api/OrderTableApi";
import { AppContext } from "../../SideNav";
const { Text } = Typography;

function Sales() {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);

  const { store } = useContext(AppContext);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch Orders Total Stats
  async function fetchOrdersStats() {
    const response = await OrderTableApi.fetchOrdersCounts(store.s_id);

    if (response) {
      const { count, totalSales } = response;
      setOrderCount(count);
      setTotalSales(totalSales);
    }
  }

  // fetch Orders Total Monthly Stats
  async function fetchMonthlyData() {
    const response = await OrderTableApi.fetchMonthlySales(store.s_id);

    if (response) {
      const { totalSales, count } = response;
      setMonthlySales(totalSales);
      setMonthlyOrders(count);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchOrdersStats();
      fetchMonthlyData();
    }
  }, [store?.s_id]);

  return (
    <>
      {isMobileView ? (
        <>
          <CapsuleTabs defaultActiveKey="1">
            <CapsuleTabs.Tab title="Store Sale " key="1">
              <Card
                // title={
                //   <span>
                //     <FundTwoTone
                //       twoToneColor="#52c41a"
                //       style={{ marginRight: 8 }}
                //     />
                //     Sales Statistics
                //   </span>
                // }
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
                    Rs. {totalSales}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 12,
                      color: "#8c9097",
                    }}
                  >
                    TOTAL
                  </Text>
                </Space>
              </Card>
            </CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="Total Sale" key="2">
              <Card
                // title={
                //   <span>
                //     <FundTwoTone
                //       twoToneColor="#52c41a"
                //       style={{ marginRight: 8 }}
                //     />
                //     Sales Statistics
                //   </span>
                // }
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
                    Rs. {monthlySales}
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
              </Card>{" "}
            </CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="Store Orders" key="3">
              <Card
                // title={
                //   <span>
                //     <FundTwoTone
                //       twoToneColor="#52c41a"
                //       style={{ marginRight: 8 }}
                //     />
                //     Sales Statistics
                //   </span>
                // }
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
                    {orderCount}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 12,
                      color: "#8c9097",
                    }}
                  >
                    TOTAL ORDERS
                  </Text>
                </Space>
              </Card>
            </CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="Month Orders" key="4">
              <Card
                // title={
                //   <span>
                //     <FundTwoTone
                //       twoToneColor="#52c41a"
                //       style={{ marginRight: 8 }}
                //     />
                //     Sales Statistics
                //   </span>
                // }
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
                    {monthlyOrders}
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
            </CapsuleTabs.Tab>
          </CapsuleTabs>
        </>
      ) : (
        <>
          {/* <Typography.Title
            level={4}
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            Sales
          </Typography.Title> */}
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <FundTwoTone
                      twoToneColor="#52c41a"
                      style={{ marginRight: 8 }}
                    />
                    Store Sale
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
                    Rs. {totalSales}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 12,
                      color: "#8c9097",
                    }}
                  >
                    TOTAL SALE
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
                    Total Sale
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
                    Rs. {monthlySales}
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
                    Store Orders
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
                    {orderCount}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 12,
                      color: "#8c9097",
                    }}
                  >
                    TOTAL ORDERS
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
                    Orders
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
                    {monthlyOrders}
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
          </Row>
        </>
      )}
      <Orders></Orders>
    </>
  );
}

export default Sales;
