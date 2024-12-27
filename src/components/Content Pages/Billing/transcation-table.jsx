import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  PlusSquareTwoTone,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { AppContext } from "../../SideNav";
import TranscationApi from "../../../api/TranscationApi";

function TranscationTable({ searchTerm }) {
  const navigate = useNavigate();

  const handleAddVisitClick = (id) => {
    navigate(`/customer/${id}/order/`);
  };

  const [transcation, setTranscation] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const { user, store } = useContext(AppContext);

  const handleViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };

  async function fetchData(searchTerm) {
    try {
      const result = await TranscationApi.fetchOrderTranscaton(
        searchTerm,
        store.s_id
      );
      console.log(result, "ttt");
      setTranscation(result);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchData(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

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
      title: "Transcation ID",
      dataIndex: "id",
    },
    {
      title: "Customer Name",
      dataIndex: ["customers", "name"],
      render: (name) => name || "N/A",
    },
    {
      title: "Transcation Type",
      dataIndex: "trans_type",
    },
    {
      title: "Total Amount",
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
            onClick={() => handleViewClick(record.id)}
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
            color="primary"
            variant="filled"
            size="small"
            onClick={() => handleAddVisitClick(record.id)}
          >
            <PlusSquareTwoTone twoToneColor="#52c41a" />
          </Button>

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
      <Table columns={columns} dataSource={transcation} size="middle" />
    </>
  );
}

export default TranscationTable;
