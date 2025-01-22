import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  PlusSquareTwoTone,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { AppContext } from "../../../SideNav";
import TransactionApi from "../../../../api/TransactionApi";
import TransactionViewModal from "../Modal/transactionView";

function TransactionTable({ searchTerm, selectedCustomer }) {
  const navigate = useNavigate();

  const handleAddVisitClick = (id) => {
    navigate(`/customer/${id}/order/`);
  };

  const [transaction, setTransaction] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const { user, store } = useContext(AppContext);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showViewModal = (record) => {
    setSelectedTransaction(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  async function fetchData() {
    try {
      const result = await TransactionApi.fetchOrderTransacton(
        searchTerm,
        selectedCustomer,
        store.s_id
      );
      // console.log(result, "ttt");
      setTransaction(result);
    } catch (error) {
      console.error("Failed to fetch Transaction:", error);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchData();
    }
  }, [searchTerm, selectedCustomer, store?.s_id]);

  const handleHistoryViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };

  const handleOrderViewDetails = (id) => {
    navigate(`/orderdetails/${id}`);
    // navigate(`/orderdetails`, { state: { customer } });
  };

  // const handleDelete = async (customerId) => {
  //   const isDeleted = await CustomerAPI.deleteCustomer(customerId);
  //   if (isDeleted) {
  //     setTranscation(customers.filter((customer) => customer.id !== customerId));
  //   }
  // };
  const { confirm } = Modal;
  // const showDeleteConfirm = (customerId) => {
  //   confirm({
  //     title: "Are you sure delete this Customer?",
  //     icon: <ExclamationCircleFilled />,
  //     okText: "Yes",
  //     okType: "danger",
  //     cancelText: "No",
  //     onOk: () => handleDelete(customerId),
  //     onCancel() {},
  //   });
  // };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            if (record.order_id) {
              handleOrderViewDetails(record.order_id);
            }
          }}
          style={{ padding: 0, height: "auto" }}
        >
          {record.order_id || "N/A"}
        </Button>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: ["customers", "name"],
      // render: (name) => name || "N/A",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleHistoryViewClick(record.customers.id)}
          style={{ padding: 0, height: "auto" }}
        >
          {record.customers.name}
        </Button>
      ),
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
      title: "Total Amount",
      dataIndex: "total_price",
      render: (total_price, record) => (
        <span
          style={{ color: record.trans_type === "Credit" ? "green" : "red" }}
        >
          {total_price}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            color="primary"
            size="small"
            variant="filled"
            onClick={() => showViewModal(record)}
          >
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>
          <Button
            color="primary"
            size="small"
            variant="filled"
            // onClick={() => showEditModal(record)}
          >
            <EditOutlined />
          </Button>
          {/* <Button
            color="primary"
            variant="filled"
            size="small"
            onClick={() => handleAddVisitClick(record.id)}
          >
            <PlusSquareTwoTone twoToneColor="#52c41a" />
          </Button> */}

          <Button
            color="danger"
            variant="filled"
            size="small"
            // onClick={() => showDeleteConfirm(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* <h4>Total Customers: {customerCount}</h4> */}
      <Table columns={columns} dataSource={transaction} size="middle" />
      <TransactionViewModal
        open={isModalOpen}
        transaction={selectedTransaction} // Pass the selected transaction
        onModalClose={handleModalClose}
      ></TransactionViewModal>
    </>
  );
}

export default TransactionTable;
