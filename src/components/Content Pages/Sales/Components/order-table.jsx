import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal } from "antd";
import { DeleteOutlined, EditOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import OrderTableApi from "../../../../api/OrderTableApi";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { AppContext } from "../../../SideNav";

const { confirm } = Modal;

function OrderTable({ searchTerm }) {
  const navigate = useNavigate();

  const handleHistoryViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };
  const handleOrderViewDetails = (id) => {
    navigate(`/orderdetails/${id}`);
    // navigate(`/orderdetails`, { state: { customer } });
  };

  const handleEditVisitClick = (customer_id, order_id) => {
    navigate(`/customer/${customer_id}/order/${order_id}`);
  };

  const [data, setData] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const { user, store } = useContext(AppContext);

  async function fetchTableOrders(searchTerm) {
    const response = await OrderTableApi.fetchOrders(searchTerm, store.s_id);
    if (response) {
      const { orders, count } = response;
      setData(orders);
      setOrderCount(count);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchTableOrders(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

  const handleDelete = async (order_id) => {
    const isDeleted = await OrderTableApi.deleteOrder(order_id);
    if (isDeleted) {
      setData(data.filter((order) => order.order_id !== order_id));
    }
  };
  const showDeleteConfirm = (order_id) => {
    confirm({
      title: "Are you sure delete this Order?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(order_id),
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (order_id) => (
        <Link onClick={() => console.log("Order ID clicked:", order_id)}>
          {order_id}
        </Link>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleHistoryViewClick(record.customers.id)}
        >
          {record.customers.name}
        </Button>
      ),
    },
    {
      title: "Phone No",
      render: (_, record) => record.customers.phone,
    },
    {
      title: "Total Items",
      dataIndex: "total_items",
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            color="primary"
            variant="filled"
            size="small"
            onClick={() => handleOrderViewDetails(record.order_id)}
          >
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>
          <Button
            onClick={() =>
              handleEditVisitClick(record.customers.id, record.order_id)
            }
            color="primary"
            size="small"
            variant="filled"
          >
            <EditOutlined />
          </Button>
          <Button
            color="danger"
            variant="filled"
            size="small"
            onClick={() => showDeleteConfirm(record.order_id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h4>Total Orders: {orderCount}</h4>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="orderid"
        size="middle"
      />
    </>
  );
}

export default OrderTable;
