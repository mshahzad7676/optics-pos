import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Descriptions, Typography, Flex, Tag } from "antd";
import { Form, Col, Input, Select, Row } from "antd";
import OrderTableApi from "../../../../../api/OrderTableApi";

import PrescriptionView from "../../../Customers/components/PrescriptionView";

function OrderDetails() {
  const { order_id } = useParams();
  const [customerData, setCustomerData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  console.log(orderData, "order");

  useEffect(() => {
    async function fetchData() {
      const data = await OrderTableApi.fetchOrderDetails(order_id);
      // console.log(data, "00");
      setCustomerData(data?.[0]?.customers || []);
      setOrderData(data?.[0]?.order_items || []);
      setTransactionData(data?.[0]?.order_transactions);
    }
    fetchData();
  }, [order_id]);

  const column = [
    {
      title: "Transaction ID",
      dataIndex: "id",
    },
    {
      title: "Transaction Type",
      dataIndex: "trans_type",
      render: (_, record) => (
        <Tag color={record.trans_type === "Credit" ? "green" : "red"}>
          {record.trans_type}
        </Tag>
      ),
    },
    {
      title: "Order Amount",
      dataIndex: "total_price",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
  ];

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
  const getColumns = (records) => {
    // Check if any record has `category` as "Glasses"
    const isGlasses = records.some((record) => record.category === "Glasses");

    // If "Glasses" exists, return an empty array of columns
    return isGlasses ? [] : columns;
  };
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
      {orderData?.[0]?.category === "Glasses" && (
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            maxWidth: "550px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <span style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography component="span">
              Order Item ID: {orderData?.[0]?.order_item_id}
            </Typography>
            <Typography component="span">
              Order Category: {orderData?.[0]?.category}
            </Typography>
          </span>
          <br></br>

          <Row
            style={{
              display: Flex,
              justifyContent: "center",
              borderBottom: "1px solid black",
              paddingBottom: 5,
            }}
          >
            <Col span={3}>Qty</Col>
            <Col span={3}>Sph.</Col>
            <Col span={3}>Cyl.</Col>
            <Col span={3}>Add.</Col>
            <Col span={3}>Price</Col>
          </Row>
          {orderData.map((data) => (
            <Row
              style={{
                display: Flex,
                justifyContent: "center",
                borderBottom: "1px solid black",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              <Col span={3}>{data.order_item_object.glass?.quantity}</Col>
              <Col span={3}>{data.order_item_object?.glass?.sph}</Col>
              <Col span={3}>{data.order_item_object?.glass?.cyl}</Col>
              <Col span={3}>{data.order_item_object?.glass?.addition}</Col>
              <Col span={3}>{data.order_item_object?.glass?.price}</Col>
            </Row>
          ))}
        </div>
      )}

      <Table
        // columns={columns}
        columns={getColumns(orderData)}
        pagination={false}
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
                    <Descriptions.Item label="Frame Category">
                      {record?.order_item_object.frame?.category}
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
                  <div
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      maxWidth: "550px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography component="span">
                        Order Item ID: {orderData?.[0]?.order_item_id}
                      </Typography>
                      <Typography component="span">
                        Order Category: {orderData?.[0]?.category}
                      </Typography>
                    </span>
                    <br></br>

                    <Typography component="span">
                      <strong>Frame Details</strong>
                    </Typography>
                    <Row
                      style={{
                        display: Flex,
                        justifyContent: "center",
                        borderBottom: "1px solid black",
                        paddingBottom: 5,
                      }}
                    >
                      <Col span={4}>Category</Col>
                      <Col span={4}>Shape</Col>
                      <Col span={4}>Comments</Col>
                      <Col span={4}>Price</Col>
                    </Row>
                    {orderData.map((data) => (
                      <Row
                        style={{
                          display: Flex,
                          justifyContent: "center",
                          borderBottom: "1px solid black",
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                      >
                        <Col span={4}>
                          {data.order_item_object.frame?.category}
                        </Col>
                        <Col span={4}>
                          {data.order_item_object?.frame?.shape}
                        </Col>
                        <Col span={4}>
                          {data.order_item_object?.frame?.comment}
                        </Col>

                        <Col span={4}>
                          {data.order_item_object?.frame?.price}
                        </Col>
                      </Row>
                    ))}
                    <Typography component="span">
                      <strong>Lens Details</strong>
                    </Typography>
                    <Row
                      style={{
                        display: Flex,
                        justifyContent: "center",
                        borderBottom: "1px solid black",
                        paddingBottom: 5,
                      }}
                    >
                      <Col span={5}>Category</Col>
                      <Col span={3}>Type</Col>
                      <Col span={4}>Comments</Col>
                      <Col span={4}>Price</Col>
                    </Row>
                    {orderData.map((data) => (
                      <Row
                        style={{
                          display: Flex,
                          justifyContent: "center",
                          borderBottom: "1px solid black",
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                      >
                        <Col span={5}>
                          {data.order_item_object.lens?.lcategory}
                        </Col>
                        <Col span={3}>{data.order_item_object?.lens?.type}</Col>
                        <Col span={4}>
                          {data.order_item_object?.lens?.comment}
                        </Col>

                        <Col span={4}>
                          {data.order_item_object?.lens?.price}
                        </Col>
                      </Row>
                    ))}
                    <Row
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Col span={5}>Total Amount :</Col>
                      <Col span={8}>{transactionData?.[0]?.total_price}</Col>
                    </Row>
                  </div>

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
            }
          },
        }}
      />

      {/* <Descriptions
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      >
        <Descriptions.Item label="Transcation ID">
          {transactionData?.[0]?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Transcation Type">
          {transactionData?.[0]?.trans_type}
        </Descriptions.Item>
        <Descriptions.Item label="Total Order Price">
          {transactionData?.[0]?.total_price}
        </Descriptions.Item>
        <Descriptions.Item label="Balance">
          {transactionData?.[0]?.balance}
        </Descriptions.Item>
      </Descriptions> */}
      <Typography.Title
        level={2}
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Transaction Info.
      </Typography.Title>
      <Table
        columns={column}
        rowKey="order_item_id"
        pagination={false}
        dataSource={transactionData}
      ></Table>
    </>
  );
}

export default OrderDetails;
