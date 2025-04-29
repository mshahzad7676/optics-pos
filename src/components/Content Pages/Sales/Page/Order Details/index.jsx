import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Descriptions,
  Typography,
  Flex,
  Tag,
  Button,
  Divider,
} from "antd";
import { Form, Col, Input, Select, Row } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import OrderTableApi from "../../../../../api/OrderTableApi";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import PrescriptionView from "../../../Customers/components/PrescriptionView";

function OrderDetails() {
  const { order_id } = useParams();
  const orderRef = useRef(null);
  const [customerData, setCustomerData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  // const [balanceData, setBalanceData] = useState([]);

  console.log(orderData, "order");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await OrderTableApi.fetchOrderDetails(order_id);
      // console.log(data, "00");
      setCustomerData(data?.[0]?.customers || []);
      setOrderData(data?.[0]?.order_items || []);
      setOrderInfo(data || []);
      setTransactionData(data?.[0]?.order_transactions);
    }
    fetchData();
  }, [order_id]);

  // useEffect(() => {
  //   async function fetchBalanceData() {
  //     const data = await TransactionApi.fetchCustomerTransacton(
  //       customerData.id,
  //       order_id
  //     );
  //     console.log(data, "00");
  //     setBalanceData(data);
  //   }
  //   fetchBalanceData();
  // }, [customerData.id, order_id]);

  const column = [
    {
      title: "T.ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
    },
    {
      title: "T.Type",
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
      title: "Order Item ID",
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
  // const getColumns = (records) => {
  //   // Check if any record has `category` as "Glasses"
  //   const isGlasses = records.some((record) => record.category === "Glasses");

  //   // If "Glasses" exists, return an empty array of columns
  //   return isGlasses ? [] : columns;
  // };

  const sharePDF = () => {
    if (!orderRef.current) {
      console.error("Error: Element not found.");
      return;
    }

    html2canvas(orderRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // const imgHeight = 150;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // pdf.save("Order_Details.pdf");
      pdf.save(`${orderData?.[0]?.category}_${orderInfo?.[0]?.order_id}.pdf`);

      // const phone = "923075487676";
      const phone = `${customerData.phone}`;
      const message = encodeURIComponent("Here is your Order details.");
      const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 2000);
    });
  };

  const calculateRetailTotalPrice = (orderItems) => {
    return orderItems.reduce((total, order) => {
      const { order_item_object } = order;

      const lensPrice = order_item_object.lens?.price
        ? parseFloat(order_item_object.lens.price)
        : 0;
      const framePrice = order_item_object.frame?.price
        ? parseFloat(order_item_object.frame.price)
        : 0;
      const contactLensPrice = order_item_object.contactLense?.price
        ? parseFloat(order_item_object.contactLense.price)
        : 0;

      return total + lensPrice + framePrice + contactLensPrice;
    }, 0);
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, order) => {
      const { order_item_object } = order;

      const glassPrice = order_item_object.glass?.price
        ? parseFloat(order_item_object.glass.price)
        : 0;

      return total + glassPrice;
    }, 0);
  };

  const calculatePreviousBal = (orderItems) => {
    const bal2 = transactionData?.[1]?.balance ?? 0;
    const bal1 = transactionData?.[0]?.balance ?? 0;

    const retailTotal = calculateRetailTotalPrice(orderItems);
    // const paidRetailAmount = transactionData?.[0]?.total_price ?? 0;
    const paidRetailAmount =
      calculateTotalRetailPaid(orderItems)?.total_amount_paid ?? 0;
    const retailBalance = retailTotal - -paidRetailAmount ?? 0;

    const wholesaleTotal = calculateTotalPrice(orderItems);
    const paidWohleSaleAmount = transactionData?.[0]?.total_price ?? 0;
    const wholesaleBalance = wholesaleTotal - paidWohleSaleAmount ?? 0;

    const isDebit = transactionData?.[0]?.trans_type === "Debit";

    // retail previousBalance
    const previousBal1 = isDebit ? bal1 - retailBalance : bal1 + retailTotal;
    const previousBal2 = isDebit ? bal2 - retailBalance : bal2 + retailTotal;

    // Wholesale - subtract if debit, add if credit
    const previousBal3 = isDebit
      ? bal1 - wholesaleBalance
      : bal1 + wholesaleTotal;
    const previousBal4 = isDebit
      ? bal2 - wholesaleBalance
      : bal2 + wholesaleTotal;

    // wholesale previousBalance
    // const updatedBal3 = bal1 + wholesaleTotal;
    // const updatedBal4 = bal2 + wholesaleTotal;

    return {
      previousRBalance1: previousBal1,
      previousRBalance2: previousBal2,
      previousWBalance1: previousBal3,
      previousWBalance2: previousBal4,
    };
  };

  // const calculateTotalRetailPaid = () => {

  //   const item1 = transactionData?.[1]?.total_price ?? 0;
  //   const item2 = transactionData?.[3]?.total_price ?? 0;

  //   const total_paid = (item1 + item2) * -1;
  //   return {
  //     total_amount_paid: total_paid,
  //   };
  // };

  const calculateTotalRetailPaid = () => {
    const total_paid = transactionData?.reduce((sum, item) => {
      if (item?.trans_type === "Debit") {
        const price = item?.total_price ?? 0;
        return sum + price;
      }
      return sum;
    }, 0);

    return {
      total_amount_paid: total_paid * -1,
    };
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

      <Row justify="space-between" align="middle" style={{ marginTop: 25 }}>
        <h2>Order Details</h2>
        <Button
          type="primary"
          style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
          icon={<WhatsAppOutlined />}
          onClick={sharePDF}
        >
          Share
        </Button>
      </Row>
      {/* {orderData?.[0]?.category === "Glasses" &&
        orderData?.[0]?.category !== "Eye Wear" && (
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              maxWidth: "550px",
              marginLeft: "auto",
              marginRight: "auto",
              // display: "none",
            }}
            id="order-content"
            ref={orderRef}
          >
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography component="span">
                ID: {orderInfo?.[0]?.order_id}
              </Typography>
              <Typography component="span">
                Category: {orderData?.[0]?.category}
              </Typography>
              <Typography component="span">
                Date: {orderInfo?.[0]?.order_date.split("T")[0]}
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
        )} */}

      {isMobileView ? (
        <>
          {orderData?.[0]?.category === "Glasses" && (
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                maxWidth: "550px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              id="order-content"
              ref={orderRef}
            >
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography component="span">
                  ID: {orderInfo?.[0]?.order_id}
                </Typography>
                {/* <Typography component="span">
                  Category: {orderData?.[0]?.category}
                </Typography> */}
                <Typography component="span">
                  Date: {orderInfo?.[0]?.order_date.split("T")[0]}
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
                <Col span={4}>Type</Col>
                <Col span={4}>Sph.</Col>
                <Col span={4}>Cyl.</Col>
                <Col span={4}>Add.</Col>
                <Col span={4}>Qty</Col>
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
                  <Col span={4}>{data.order_item_object?.glass?.type}</Col>
                  <Col span={4}>{data.order_item_object?.glass?.sph}</Col>
                  <Col span={4}>{data.order_item_object?.glass?.cyl}</Col>
                  <Col span={4}>{data.order_item_object?.glass?.addition}</Col>
                  <Col span={4}>{data.order_item_object.glass?.quantity}</Col>
                  <Col span={4}>{data.order_item_object?.glass?.price}</Col>
                </Row>
              ))}
              {/* <Row>
                <Col span={19} style={{ textAlign: "right" }}>
                  <strong>Total Amount:</strong>
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                  {calculateTotalPrice(orderData)}
                </Col>
              </Row> */}
              <Row>
                <Col span={19} style={{ textAlign: "right" }}>
                  <strong>Pre. Balance:</strong>
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                  {/* {balanceData?.[1]?.balance} */}
                  {transactionData?.[1]?.trans_type === "Debit"
                    ? calculatePreviousBal(orderData)?.previousWBalance1
                    : calculatePreviousBal(orderData)?.previousWBalance2}
                </Col>
                <Col span={19} style={{ textAlign: "right" }}>
                  <strong>Total:</strong>
                </Col>
                {/* <Col span={4} style={{ textAlign: "right" }}>
                  {calculateTotalPrice(orderData)}{" "}
                  {transactionData?.[1]?.trans_type}
                </Col> */}
                <Col span={5} style={{ textAlign: "center", color: "green" }}>
                  <span>{calculateTotalPrice(orderData)}</span>
                </Col>
                <Col span={19} style={{ textAlign: "right" }}>
                  <strong>Paid:</strong>
                </Col>

                <Col span={5} style={{ textAlign: "center" }}>
                  <span style={{ color: "red" }}>
                    {transactionData?.[0]
                      ? Number(transactionData[0].total_price) === 0
                        ? "0"
                        : `${
                            transactionData[0].trans_type === "Debit" ? "-" : ""
                          } ${transactionData[0].total_price}`
                      : "0"}
                  </span>
                </Col>

                <Col span={19} style={{ textAlign: "right" }}>
                  <strong>Balance:</strong>
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                  {transactionData?.[0]?.balance ??
                    transactionData?.[1]?.balance}
                </Col>
              </Row>
            </div>
          )}
        </>
      ) : (
        <>
          {orderData?.[0]?.category === "Glasses" && (
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                maxWidth: "550px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              id="order-content"
              ref={orderRef}
            >
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography component="span">
                  Order ID: {orderInfo?.[0]?.order_id}
                </Typography>
                <Typography component="span">
                  Order Category: {orderData?.[0]?.category}
                </Typography>
                <Typography component="span">
                  Order Date: {orderInfo?.[0]?.order_date.split("T")[0]}
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
                <Col span={3}>Type</Col>
                <Col span={3}>Sph.</Col>
                <Col span={3}>Cyl.</Col>
                <Col span={3}>Add.</Col>
                <Col span={3}>Qty</Col>
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
                  <Col span={3}>{data.order_item_object?.glass?.type}</Col>
                  <Col span={3}>{data.order_item_object?.glass?.sph}</Col>
                  <Col span={3}>{data.order_item_object?.glass?.cyl}</Col>
                  <Col span={3}>{data.order_item_object?.glass?.addition}</Col>
                  <Col span={3}>{data.order_item_object.glass?.quantity}</Col>
                  <Col span={3}>{data.order_item_object?.glass?.price}</Col>
                </Row>
              ))}
              <Row>
                <Col span={16} style={{ textAlign: "right" }}>
                  <strong>Pre. Balance:</strong>
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                  {/* {balanceData?.[1]?.balance} */}
                  {transactionData?.[0]?.trans_type === "Debit"
                    ? calculatePreviousBal(orderData)?.previousWBalance1
                    : calculatePreviousBal(orderData)?.previousWBalance2}
                </Col>
                <Col span={16} style={{ textAlign: "right" }}>
                  <strong>Total:</strong>
                </Col>

                <Col span={5} style={{ textAlign: "center" }}>
                  <span style={{ color: "green" }}>
                    {/* {transactionData?.[1]?.trans_type === "Debit" ? "-" : "+"}{" "} */}
                    {calculateTotalPrice(orderData)}
                  </span>
                </Col>
                <Col span={16} style={{ textAlign: "right" }}>
                  <strong>Paid:</strong>
                </Col>

                <Col span={5} style={{ textAlign: "center" }}>
                  <span style={{ color: "red" }}>
                    {transactionData?.[0]
                      ? Number(transactionData[0].total_price) === 0
                        ? "0"
                        : `${
                            transactionData[0].trans_type === "Debit" ? "-" : ""
                          } ${transactionData[0].total_price}`
                      : "0"}
                  </span>
                </Col>

                <Col span={16} style={{ textAlign: "right" }}>
                  <strong>Balance:</strong>
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                  {transactionData?.[0]?.balance}
                  {/* {transactionData?.[0]?.balance ??
                    transactionData?.[1]?.balance} */}
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
      {orderData?.[0]?.category !== "Glasses" && (
        <>
          <Table
            columns={columns}
            // columns={getColumns(orderData)}
            pagination={false}
            rowKey="order_item_id"
            // rowKey="order_id"
            dataSource={orderData}
            expandable={{
              expandedRowRender: (record) => {
                if (
                  record.category === "Eye Wear" ||
                  record.category === "Sun Glasses"
                ) {
                  return (
                    <>
                      <div
                        style={{
                          border: "1px solid black",
                          padding: "10px",
                          maxWidth: "550px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        id="order-content"
                        ref={orderRef}
                      >
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <Typography component="span">
                            {/* Order Item ID: {orderData?.[0]?.order_id} */}
                            ID: {orderInfo?.[0]?.order_id}
                          </Typography>
                          <Typography component="span">
                            {orderData?.[0]?.category ??
                              orderData?.[1]?.category}
                          </Typography>
                          <Typography component="span">
                            {orderInfo?.[0]?.order_date.split("T")[0]}
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
                          <Col span={6} style={{ textAlign: "center" }}>
                            Category
                          </Col>
                          <Col span={7} style={{ textAlign: "center" }}>
                            Shape
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            Qty
                          </Col>
                          <Col span={6} style={{ textAlign: "center" }}>
                            Price
                          </Col>
                        </Row>
                        {orderData.map((data, index) => (
                          <React.Fragment key={data.order_id || index}>
                            <Row
                              style={{
                                display: Flex,
                                justifyContent: "center",
                                // borderBottom: "1px solid black",
                                marginBottom: 10,
                                marginTop: 10,
                              }}
                            >
                              <Col
                                span={6}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object.frame?.category}
                              </Col>
                              <Col
                                span={7}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object?.frame?.shape}
                              </Col>

                              <Col
                                span={5}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object.frame?.quantity}
                              </Col>

                              <Col
                                span={6}
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {data.order_item_object?.frame?.price}
                              </Col>
                            </Row>
                            {data.order_item_object?.frame?.comment && (
                              <Row
                                style={{
                                  borderBottom: "1px solid black",
                                  marginBottom: 10,
                                }}
                              >
                                <Col span={24}>
                                  <strong>Comments:</strong>{" "}
                                  {data.order_item_object?.frame?.comment}
                                </Col>
                              </Row>
                            )}
                          </React.Fragment>
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
                          <Col
                            span={7}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Category
                          </Col>
                          <Col
                            span={6}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Type
                          </Col>
                          <Col
                            span={6}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Qty.
                          </Col>

                          <Col
                            span={5}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Price
                          </Col>
                        </Row>
                        {orderData.map((data, index) => (
                          <React.Fragment key={data.order_id || index}>
                            <Row
                              style={{
                                display: Flex,
                                justifyContent: "center",
                                // borderBottom: "1px solid black",
                                marginBottom: 10,
                                marginTop: 10,
                              }}
                            >
                              <Col
                                span={7}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object.lens?.lcategory}
                              </Col>
                              <Col
                                span={6}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object?.lens?.type}
                              </Col>
                              <Col
                                span={6}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object?.lens?.qty}
                              </Col>

                              <Col
                                span={5}
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {data.order_item_object?.lens?.price}
                              </Col>
                            </Row>
                            {data.order_item_object?.lens?.comment && (
                              <Row style={{ borderBottom: "1px solid black" }}>
                                <Col span={24}>
                                  <strong>Comments:</strong>{" "}
                                  {data.order_item_object?.lens?.comment}
                                </Col>
                              </Row>
                            )}
                          </React.Fragment>
                        ))}
                        {/* <Row>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Total Amount:</strong>
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            {calculateRetailTotalPrice(orderData)}
                          </Col>
                        </Row> */}
                        <Row>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Pre. Balance:</strong>
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            {/* {balanceData?.[1]?.balance} */}
                            {transactionData?.[0]?.trans_type === "Debit"
                              ? calculatePreviousBal(orderData)
                                  ?.previousRBalance1
                              : calculatePreviousBal(orderData)
                                  ?.previousRBalance2}
                          </Col>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Total:</strong>
                          </Col>

                          <Col span={5} style={{ textAlign: "center" }}>
                            <span style={{ color: "Green" }}>
                              {calculateRetailTotalPrice(orderData)}
                            </span>
                          </Col>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Paid:</strong>
                          </Col>

                          <Col span={5} style={{ textAlign: "center" }}>
                            <span style={{ color: "red" }}>
                              {/* {transactionData?.[1]
                                ? `${
                                    transactionData[0].trans_type === "Debit"
                                      ? "-"
                                      : ""
                                  } ${
                                    calculateTotalRetailPaid(orderData)
                                      ?.total_amount_paid ?? "0"
                                  }`
                                : "0"} */}

                              {
                                calculateTotalRetailPaid(orderData)
                                  ?.total_amount_paid
                              }
                            </span>
                          </Col>

                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Balance:</strong>
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            {transactionData?.[0]?.balance ?? "Nill"}
                            {/* {transactionData?.[0]?.balance ??
                              "Nill" ??
                              transactionData?.[1]?.balance ??
                              "Nill"} */}
                          </Col>
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
                } else if (
                  record.category === "Contact Lense"
                  // &&
                  // record.category === "Eye Wear"
                ) {
                  return (
                    <>
                      <div
                        style={{
                          border: "1px solid black",
                          padding: "10px",
                          maxWidth: "550px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        id="order-content"
                        ref={orderRef}
                      >
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography component="span">
                            {/* Order Item ID: {orderData?.[0]?.order_id} */}
                            ID: {orderInfo?.[0]?.order_id}
                          </Typography>
                          <Typography component="span">
                            {orderData?.[1]?.category}
                          </Typography>
                          <Typography component="span">
                            {orderInfo?.[0]?.order_date.split("T")[0]}
                          </Typography>
                        </span>
                        <br></br>

                        <Typography component="span">
                          <strong>Contact Lens Details</strong>
                        </Typography>
                        <Row
                          style={{
                            display: Flex,
                            justifyContent: "center",
                            borderBottom: "1px solid black",
                            paddingBottom: 5,
                          }}
                        >
                          <Col span={7} style={{ textAlign: "center" }}>
                            Category
                          </Col>
                          <Col span={6} style={{ textAlign: "center" }}>
                            Brand
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            Qty.
                          </Col>
                          <Col span={6} style={{ textAlign: "center" }}>
                            Price
                          </Col>
                        </Row>
                        {orderData.map((data, index) => (
                          <React.Fragment key={data.order_id || index}>
                            <Row
                              style={{
                                display: Flex,
                                justifyContent: "center",
                                // borderBottom: "1px solid black",
                                marginBottom: 10,
                                marginTop: 5,
                              }}
                            >
                              <Col
                                span={7}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object.contactLense?.category}
                              </Col>
                              <Col
                                span={6}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object?.contactLense?.brand}
                              </Col>

                              <Col
                                span={5}
                                style={{
                                  textAlign: "center",
                                  borderRight: "1px solid black",
                                }}
                              >
                                {data.order_item_object?.contactLense?.qty}
                              </Col>

                              <Col span={6} style={{ textAlign: "center" }}>
                                {data.order_item_object?.contactLense?.price}
                              </Col>
                            </Row>
                            {data.order_item_object?.contactLense?.comment && (
                              <Row style={{ borderBottom: "1px solid black" }}>
                                <Col span={24}>
                                  <strong>Comments:</strong>{" "}
                                  {
                                    data.order_item_object?.contactLense
                                      ?.comment
                                  }
                                </Col>
                              </Row>
                            )}
                          </React.Fragment>
                        ))}
                        <Row>
                          <Col span={18} style={{ textAlign: "right" }}>
                            Total Amount :
                          </Col>
                          {/* <Col span={8}>{transactionData?.[0]?.total_price}</Col> */}
                          {/* <Col span={6} style={{ textAlign: "center" }}>
                            {(() => {
                              let orderItemPrice = 0;
                              if (record.order_item_object) {
                                Object.values(record.order_item_object).forEach(
                                  (item) => {
                                    if (
                                      item &&
                                      typeof item === "object" &&
                                      item.price
                                    ) {
                                      orderItemPrice += parseInt(
                                        item.price,
                                        10
                                      );
                                    }
                                  }
                                );
                              }
                              return orderItemPrice;
                            })()}
                          </Col> */}
                        </Row>
                        <Row>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Pre. Balance:</strong>
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            {/* {balanceData?.[1]?.balance} */}
                            {transactionData?.[0]?.trans_type === "Debit"
                              ? calculatePreviousBal(orderData)
                                  ?.previousRBalance1
                              : calculatePreviousBal(orderData)
                                  ?.previousRBalance2}
                          </Col>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Total:</strong>
                          </Col>

                          <Col span={5} style={{ textAlign: "center" }}>
                            <span style={{ color: "Green" }}>
                              {(() => {
                                let orderItemPrice = 0;
                                if (record.order_item_object) {
                                  Object.values(
                                    record.order_item_object
                                  ).forEach((item) => {
                                    if (
                                      item &&
                                      typeof item === "object" &&
                                      item.price
                                    ) {
                                      orderItemPrice += parseInt(
                                        item.price,
                                        10
                                      );
                                    }
                                  });
                                }
                                return orderItemPrice;
                              })()}
                            </span>
                          </Col>
                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Paid:</strong>
                          </Col>

                          <Col span={5} style={{ textAlign: "center" }}>
                            <span style={{ color: "red" }}>
                              {/* {transactionData?.[1]
                                ? `${
                                    transactionData[0].trans_type === "Debit"
                                      ? "-"
                                      : ""
                                  } ${
                                    calculateTotalRetailPaid(orderData)
                                      ?.total_amount_paid ?? "0"
                                  }`
                                : "0"} */}

                              {
                                calculateTotalRetailPaid(orderData)
                                  ?.total_amount_paid
                              }
                            </span>
                          </Col>

                          <Col span={19} style={{ textAlign: "right" }}>
                            <strong>Balance:</strong>
                          </Col>
                          <Col span={5} style={{ textAlign: "center" }}>
                            {transactionData?.[0]?.balance ?? "Nill"}
                            {/* {transactionData?.[0]?.balance ??
                              "Nill" ??
                              transactionData?.[1]?.balance ??
                              "Nill"} */}
                          </Col>
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
                }
              },
            }}
          />
        </>
      )}

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
        rowKey="id"
        pagination={false}
        dataSource={transactionData}
      ></Table>
    </>
  );
}

export default OrderDetails;
