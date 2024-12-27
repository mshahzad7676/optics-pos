import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Dropdown,
  Typography,
  Flex,
  Select,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import OrderTableApi from "../../../../api/OrderTableApi";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { AppContext } from "../../../SideNav";
import DropdownButton from "antd/es/dropdown/dropdown-button";
import MemberApi from "../../../../api/Member/MemberApi";

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
  const [members, setMembers] = useState([]);

  // fetch orders
  async function fetchTableOrders(searchTerm) {
    const response = await OrderTableApi.fetchOrders(searchTerm, store.s_id);
    console.log(response, "order");
    if (response) {
      const { orders, count } = response;
      setData(orders);
      setOrderCount(count);
    }
  }

  // Fetch members
  async function fetchMember(searchTerm) {
    try {
      const members = await MemberApi.fetchMember(searchTerm, store.s_id);
      // console.log(employees, "employees");
      if (members) {
        setMembers(members);
      }
    } catch (error) {
      console.error("Failed to fetch Member:", error);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchTableOrders(searchTerm);
      fetchMember();
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

  // Assign order
  const handleAssignOrder = async (order_id, member_id) => {
    try {
      const updatedOrder = await OrderTableApi.assignOrder(order_id, member_id);
      if (updatedOrder) {
        setData((prevData) =>
          prevData.map((order) =>
            order.order_id === order_id
              ? { ...order, assign: updatedOrder.assign }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to assign order:", error);
    }
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
        <Flex vertical align="start" justify="start">
          <Button
            type="link"
            onClick={() => handleHistoryViewClick(record.customers.id)}
            style={{ padding: 0, height: "auto" }}
          >
            {record.customers.name}
          </Button>
          <Typography.Text style={{ fontSize: "12px" }}>
            {record.customers.phone}
          </Typography.Text>
        </Flex>
      ),
    },
    // {
    //   title: "Phone No",
    //   render: (_, record) => record.customers.phone,
    // },
    {
      title: "Order Summary",
      dataIndex: "total_items",
      render: (_, record) => (
        <Flex vertical align="start" justify="start">
          <Typography.Text style={{ fontSize: "12px" }}>
            <strong>Item Quantity: </strong>
            {record.total_items}
          </Typography.Text>
          <Typography.Text style={{ fontSize: "12px" }}>
            <strong>Total Price: </strong>
            {record.total_price}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
    },
    // {
    //   title: "Total Price",
    //   dataIndex: "total_price",
    // },
    {
      title: "Assign to",
      dataIndex: "assign",
      render: (_, record) => (
        <Select
          style={{ width: 90 }}
          allowClear
          value={record.m_id}
          onChange={(value) => handleAssignOrder(record.order_id, value)}
        >
          {members.map((member) => (
            <Select.Option key={member.id} value={member.id}>
              {member.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <Tag color="red">{record.status}</Tag>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* view */}
          <Button
            color="primary"
            variant="filled"
            size="small"
            onClick={() => handleOrderViewDetails(record.order_id)}
          >
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>
          {/* update */}
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
          {/* delete */}
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
