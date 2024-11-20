import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Descriptions, Typography } from "antd";
import OrderTableApi from "../../../../../api/OrderTableApi";

import PrescriptionView from "../../../Customers/components/PrescriptionView";

function OrderDetails() {
  const { order_id } = useParams();
  const [customerData, setCustomerData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await OrderTableApi.fetchOrderDetails(order_id);
      console.log(data, "00");
      setCustomerData(data?.[0]?.customers || []);
      setOrderData(data?.[0]?.order_items || []);
    }
    fetchData();
  }, [order_id]);

  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_item_id",
    },
    {
      title: "Order Category",
      render: (_, record) => record?.category,
    },
    {
      title: "Total Price",
      render: (_, record) => {
        let orderItemPrice = 0;
        Object.values(record?.order_item_object)?.forEach((item) => {
          orderItemPrice += item.price ? parseInt(item.price) : 0;
        });
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
            }
          },
        }}
      />
    </>
  );
}

export default OrderDetails;
