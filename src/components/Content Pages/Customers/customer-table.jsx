import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  PlusSquareTwoTone,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import CustomerAPI from "../../../api/CustomerApi";
import { useNavigate } from "react-router-dom";
import EditCustomer from "./Modals/Personal-Info/editmodal";
import { AppContext } from "../../SideNav";

function CustomerTable({ searchTerm }) {
  const navigate = useNavigate();

  const handleAddVisitClick = (id) => {
    navigate(`/customer/${id}/order/`);
  };

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerCount, setCustomerCount] = useState(0);
  const { user, store } = useContext(AppContext);

  const handleViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };

  async function fetchData(searchTerm) {
    try {
      const result = await CustomerAPI.fetchCustomers(searchTerm, store.s_id);
      if (result) {
        const { data, count } = result;
        setCustomers(data);
        setCustomerCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchData(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

  const handleDelete = async (customerId) => {
    const isDeleted = await CustomerAPI.deleteCustomer(customerId);
    if (isDeleted) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    }
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (customerId) => {
    confirm({
      title: "Are you sure delete this Customer?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(customerId),
      onCancel() {},
    });
  };

  const showEditModal = (customer) => {
    setEditingCustomer(customer);
    setisEditModalOpen(true);
  };

  const handleEditOk = async (updatedCustomer) => {
    await CustomerAPI.updateCustomer(updatedCustomer);
    const updatedCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    setCustomers(updatedCustomers);
    setisEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setisEditModalOpen(false);
    setEditingCustomer(null);
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone No",
      dataIndex: "phone",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "Last Visit",
      dataIndex: "last_visit_date",
    },
    {
      title: "Total Visits",
      dataIndex: "total_visits",
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
            onClick={() => showEditModal(record)}
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
            onClick={() => showDeleteConfirm(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h4>Total Customers: {customerCount}</h4>
      <Table columns={columns} dataSource={customers} size="middle" />

      <EditCustomer
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        customer={editingCustomer}
      />
    </>
  );
}

export default CustomerTable;
