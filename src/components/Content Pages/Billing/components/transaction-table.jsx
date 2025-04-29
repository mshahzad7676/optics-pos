import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Tag, Typography, Flex } from "antd";
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

  const handleDelete = async (transId) => {
    const isDeleted = await TransactionApi.deleteTransaction(transId);
    if (isDeleted) {
      setTransaction(transaction.filter((trans) => trans.id !== transId));
    }
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (transId) => {
    confirm({
      title: "Are you sure delete this Transaction?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      maskClosable: true,
      onOk: () => handleDelete(transId),
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (_, record) => (
        <Flex vertical align="start" justify="start">
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
          <Typography.Text style={{ fontSize: "12px" }}>
            {record.orders?.order_date}
          </Typography.Text>
        </Flex>
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

          <Button
            color="danger"
            variant="filled"
            size="small"
            onClick={() => {
              console.log("Delete button clicked for ID:", record.id);
              showDeleteConfirm(record.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={transaction}
        scroll={{ y: 400 }}
        pagination={false}
        size="middle"
      />
      <TransactionViewModal
        open={isModalOpen}
        transaction={selectedTransaction}
        onModalClose={handleModalClose}
      ></TransactionViewModal>
    </>
  );
}

export default TransactionTable;
