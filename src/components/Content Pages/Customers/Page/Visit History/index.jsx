import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Timeline, Card } from "antd";
import { useParams } from "react-router-dom";
import OrderTableApi from "../../../../../api/OrderTableApi";
import "./timeline.css";

function ViewVisitedHistory() {
  const { customerId } = useParams();
  const [data, setData] = useState([]);

  async function fetchCustomerOrders() {
    const orders = await OrderTableApi.fetchCustomerOrders(customerId);
    console.log(orders, "history");
    if (orders) {
      setData(orders);
    }
  }

  useEffect(() => {
    fetchCustomerOrders();
  }, [customerId]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>Customer Visit History</h2>
      </div>

      <Timeline mode="alternate">
        {data.map((order, index) => (
          <Timeline.Item
            label={order.order_date}
            key={order.order_id}
            className="ant-timeline-item-content"
          >
            <Card
              style={{ width: "100%" }}
              title={`Order ID: ${order.order_id}`}
              extra={<Link to={`/orderdetails/${order.order_id}`}>More</Link>}
            >
              <strong>Total Items:</strong> {order.total_items}
              <br />
              <strong>Total Price:</strong> Rs. {order.total_price}
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
}

export default ViewVisitedHistory;
