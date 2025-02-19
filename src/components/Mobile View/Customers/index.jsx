import React, { useContext, useEffect, useState } from "react";
import { Card, Divider, List, Modal, SpinLoading, Toast } from "antd-mobile";
import CustomerAPI from "../../../api/CustomerApi";
import { AppContext } from "../../SideNav";
import { Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EditCustomer from "../../Content Pages/Customers/Modals/Personal-Info/editmodal";

function CustomerMobile({ searchTerm }) {
  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const { user, store } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAddVisitClick = (id) => {
    navigate(`/retail/Customer/${id}/order/`);
  };
  const handleAddVisitWholeSaleClick = (id) => {
    navigate(`/wholesale/Customer/${id}/order/`);
  };

  const handleViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };

  // Fetch customer data from backend
  async function fetchData(searchTerm) {
    setLoading(true);
    try {
      const result = await CustomerAPI.fetchCustomers(searchTerm, store.s_id);
      if (result) {
        const { data, count } = result;
        setCustomers(data);
        setCustomerCount(count);
      } else {
        setCustomers([]); // No data found
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      Toast.show({
        content: "Error fetching customer data",
        position: "bottom",
      });
    } finally {
      setLoading(false);
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
      Toast.show({ content: "Customer Deleted", duration: 1000 });
    }
  };

  const showDeleteConfirm = (customerId) => {
    Modal.confirm({
      header: (
        <ExclamationCircleFilled
          style={{
            fontSize: 64,
            color: "var(--adm-color-warning)",
          }}
        />
      ),
      title: "Attention",
      content: (
        <>
          <div style={{ textAlign: "center" }}>
            Are you sure you want to Delete Customer: {customerId}?
          </div>
        </>
      ),
      closeOnMaskClick: true,
      confirmText: "Yes, Delete",
      confirmType: "danger",
      cancelText: "No",
      onConfirm: () => handleDelete(customerId),
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

  return (
    <div style={{ padding: "10px" }}>
      <h3>Customers ({customerCount})</h3>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <SpinLoading color="primary" />
        </div>
      ) : customers.length > 0 ? (
        <>
          {customers.map((customer) => (
            <Card
              title={
                <div style={{ fontWeight: "small" }}>
                  Customer ID: {customer.id}
                </div>
              }
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                marginBottom: 10,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  // alignItems: "center",
                }}
              >
                {/* Name */}
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ paddingBottom: 5 }}>
                    <strong>{customer?.name || "N/A"}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {customer?.phone || "N/A"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {customer?.city || "N/A"}
                  </div>
                </div>
                {/* <div style={{ display: "flex", flexDirection: "row" }}> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "10px 0 0 0",
                  }}
                >
                  {/* Total Visits */}
                  <div style={{ flex: 1, textAlign: "center", width: 80 }}>
                    <strong>Total Visit: </strong>
                    <br></br>
                    {customer.total_visits || "N/A"}
                  </div>
                  {/* Visited Date */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      // marginLeft: 20,
                    }}
                  >
                    <strong style={{ wordSpacing: 5 }}>Visited Date: </strong>
                    <br></br>
                    {customer.last_visit_date
                      ? `${customer.last_visit_date}`
                      : "N/A"}
                  </div>
                </div>
                {/* </div> */}
              </div>
              <Divider style={{ margin: "5px 0 10px 0" }}></Divider>

              {/* Customer of  */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Tag
                  style={{
                    flexGrow: 1,

                    textAlign: "center",
                  }}
                  color={customer.store === "Retail" ? "green" : "blue"}
                >
                  {customer.store}
                </Tag>
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "right",
                  margin: "10px 50px 0 50px",
                  gap: "10px",
                  maxWidth: "100%",
                }}
              >
                <EyeTwoTone
                  twoToneColor="#52c41a"
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  onClick={() => handleViewClick(customer.id)}
                />
                <EditOutlined
                  style={{
                    cursor: "pointer",
                    color: "#1890ff",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  onClick={() => showEditModal(customer)}
                />
                <EditCustomer
                  open={isEditModalOpen}
                  onOk={handleEditOk}
                  onCancel={handleEditCancel}
                  customer={editingCustomer}
                />
                <PlusSquareTwoTone
                  twoToneColor="#52c41a"
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  onClick={() =>
                    customer.store === "Retail"
                      ? handleAddVisitClick(customer.id)
                      : handleAddVisitWholeSaleClick(customer.id)
                  }
                />
                <DeleteOutlined
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  onClick={() => showDeleteConfirm(customer.id)}
                />
              </div>
            </Card>
          ))}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          No customers found.
        </p>
      )}
    </div>
  );
}

export default CustomerMobile;
