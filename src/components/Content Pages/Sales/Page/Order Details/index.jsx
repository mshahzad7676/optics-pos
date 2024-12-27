import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Descriptions, Typography } from "antd";
import { Form, Col, Input, Select, Row } from "antd";
import OrderTableApi from "../../../../../api/OrderTableApi";

import PrescriptionView from "../../../Customers/components/PrescriptionView";

function OrderDetails() {
  const { order_id } = useParams();
  const [customerData, setCustomerData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  console.log(orderData, "order");

  useEffect(() => {
    async function fetchData() {
      const data = await OrderTableApi.fetchOrderDetails(order_id);
      // console.log(data, "00");
      setCustomerData(data?.[0]?.customers || []);
      setOrderData(data?.[0]?.order_items || []);
    }
    fetchData();
  }, [order_id]);

  const columns = [
    {
      title: "Order Item Id",
      dataIndex: "order_item_id",
    },
    {
      title: "Order Category",
      render: (_, record) => record?.category,
    },
    // {
    //   title: "Total Price",
    //   render: (_, record) => {
    //     let orderItemPrice = 0;
    //     Object.values(record?.order_item_object)?.forEach((item) => {
    //       orderItemPrice += item.price ? parseInt(item.price) : 0;
    //     });
    //     return orderItemPrice;
    //   },
    // },
    {
      title: "Total Price",
      render: (_, record) => {
        let orderItemPrice = 0;

        if (record?.order_item_object) {
          Object.values(record.order_item_object).forEach((item) => {
            if (item && typeof item === "object" && item.price) {
              orderItemPrice += parseInt(item.price, 10);
            }
          });
        }

        if (record?.order_item_object?.custom) {
          Object.values(record.order_item_object.custom).forEach((item) => {
            if (item && item.price) {
              orderItemPrice += parseInt(item.price, 10);
            }
          });
        }

        return orderItemPrice;
      },
    },
  ];

  return (
    <>
      <Typography.Title
        level={2}
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Customer Info.
      </Typography.Title>

      <Descriptions
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      >
        <Descriptions.Item label="Customer ID">
          {customerData.id}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Name">
          {customerData.name}
        </Descriptions.Item>
        <Descriptions.Item label="Phone No.">
          {customerData.phone}
        </Descriptions.Item>
      </Descriptions>

      <h2 style={{ marginTop: 25 }}>Order Details</h2>

      <Table
        columns={columns}
        rowKey="order_item_id"
        dataSource={orderData}
        expandable={{
          expandedRowRender: (record) => {
            if (
              record.category === "Eye Wear" ||
              record.category === "Sun Glasses"
            ) {
              return (
                <>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                    style={{ marginBottom: 20 }}
                  >
                    <Descriptions.Item label="Frame Type">
                      {record?.order_item_object.frame?.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Frame Shape">
                      {record?.order_item_object.frame?.shape}
                    </Descriptions.Item>
                    <Descriptions.Item label="Comments">
                      {record?.order_item_object.frame?.comment}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {record?.order_item_object.frame?.price}
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                    style={{ marginBottom: 20 }}
                  >
                    <Descriptions.Item label="Lens Category">
                      {record?.order_item_object.lens?.lcategory}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lens Type">
                      {record?.order_item_object.lens?.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Comments">
                      {record?.order_item_object.lens?.comment}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {record?.order_item_object.lens?.price}
                    </Descriptions.Item>
                  </Descriptions>
                  <PrescriptionView
                    prescriptionType={
                      record?.order_item_object.prescriptionType
                    }
                    orderData={record?.order_item_object.manualPrescription}
                  />
                </>
              );
            } else if (record.category === "Contact Lense") {
              return (
                <>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                  >
                    <Descriptions.Item label="Lens Category">
                      {record?.order_item_object.contactLense?.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lens Type">
                      {record?.order_item_object.contactLense?.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="Comments">
                      {record?.order_item_object.contactLense?.comment}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {record?.order_item_object.contactLense?.price}
                    </Descriptions.Item>
                  </Descriptions>
                  <PrescriptionView
                    prescriptionType={
                      record?.order_item_object.prescriptionType
                    }
                    orderData={record?.order_item_object.manualPrescription}
                  />
                </>
              );
            } else if (record.category === "Glasses Inventory") {
              return (
                <>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                  >
                    <Descriptions.Item label="Lense Type">
                      {record?.order_item_object.glass?.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lense Range ">
                      {record?.order_item_object.glass?.range}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quantity">
                      {record?.order_item_object.glass?.quantity}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {record?.order_item_object.glass?.price}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              );
            } else if (record.category === "Custom Glasses") {
              return (
                <>
                  {/* <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                  >
                    <Descriptions.Item label="Lense Type">
                      {record?.order_item_object.custom?.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Right Sph ">
                      {record?.order_item_object.custom?.right.sph}
                    </Descriptions.Item>
                    <Descriptions.Item label="Right Cyl">
                      {record?.order_item_object.custom?.right.cyl}
                    </Descriptions.Item>
                    <Descriptions.Item label="Right Addition">
                      {record?.order_item_object.custom?.right.addition}
                    </Descriptions.Item>
                    <Descriptions.Item label="Right Price">
                      {record?.order_item_object.custom?.right.price}
                    </Descriptions.Item>
                  </Descriptions> */}
                  <div
                    className="eyewear-info-container"
                    style={{ padding: "0px 10px" }}
                  >
                    {/* Glass Type */}
                    <Col span={6}>
                      <Form.Item label="Lense Type">
                        <Input
                          readOnly
                          value={record?.order_item_object.custom?.type}
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
                        <Form.Item label="Sph">
                          <Input
                            readOnly
                            value={record?.order_item_object.custom?.right?.sph}
                          ></Input>
                        </Form.Item>
                      </Col>

                      {/* Cyl */}
                      <Col span={4}>
                        <Form.Item label="Cyl">
                          <Input
                            readOnly
                            value={record?.order_item_object.custom?.right?.cyl}
                          />
                        </Form.Item>
                      </Col>
                      {/* Addition */}
                      <Col span={4}>
                        <Form.Item label="Addition">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.right?.addition
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* Lense Quantity */}
                      <Col span={4}>
                        <Form.Item label="Quantity">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.right?.quantity
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* Lense Price */}
                      <Col span={4}>
                        <Form.Item label="Price">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.right?.price
                            }
                          />
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
                        <Form.Item label="Sph">
                          <Input
                            readOnly
                            value={record?.order_item_object.custom?.left?.sph}
                          ></Input>
                        </Form.Item>
                      </Col>

                      {/* Cyl */}
                      <Col span={4}>
                        <Form.Item label="Cyl">
                          <Input
                            readOnly
                            value={record?.order_item_object.custom?.left?.cyl}
                          />
                        </Form.Item>
                      </Col>
                      {/* Addition */}
                      <Col span={4}>
                        <Form.Item label="Addition">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.left?.addition
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* Lense Quantity */}
                      <Col span={4}>
                        <Form.Item label="Quantity">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.left?.quantity
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* Lense Price */}
                      <Col span={4}>
                        <Form.Item label="Price">
                          <Input
                            readOnly
                            value={
                              record?.order_item_object.custom?.left?.price
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </>
              );
            }
          },
        }}
      />
    </>
  );
}

export default OrderDetails;
