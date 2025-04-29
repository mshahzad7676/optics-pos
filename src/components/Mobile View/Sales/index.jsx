import { List, SpinLoading, Modal, Toast, Card, Divider } from "antd-mobile";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../SideNav";
import OrderTableApi from "../../../api/OrderTableApi";
import MemberApi from "../../../api/Member/MemberApi";
import { Select, Tag } from "antd";
import { useNavigate } from "react-router-dom";

function SalesMobile({ searchTerm }) {
  const navigate = useNavigate();

  const handleHistoryViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };
  const handleOrderViewDetails = (id) => {
    navigate(`/orderdetails/${id}`);
    // navigate(`/orderdetails`, { state: { customer } });
  };

  const handleEditVisitClick = (customer_id, order_id) => {
    navigate(`/retail/customer/${customer_id}/order/${order_id}`);
  };

  const handleEditWSVisitClick = (customer_id, order_id) => {
    navigate(`/wholesale/customer/${customer_id}/order/${order_id}`);
  };

  const [data, setData] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const { user, store } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTableOrders(searchTerm) {
    setLoading(true);
    const response = await OrderTableApi.fetchOrders(searchTerm, store.s_id);
    if (response) {
      const { orders, count } = response;
      setData(orders);
      setOrderCount(count);
    }
    setLoading(false);
  }

  async function fetchMember() {
    setLoading(true);
    try {
      const members = await MemberApi.fetchMember(searchTerm, store.s_id);
      if (members) {
        setMembers(members);
      }
      setLoading(false);
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
            Are you sure you want to Delete Order: {order_id}?
          </div>
        </>
      ),
      closeOnMaskClick: true,
      confirmText: "Yes, Delete",
      cancelText: "No",
      locale: null,
      onConfirm: () => handleDelete(order_id),
      onCancel: () => {},
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

  return (
    <div style={{ padding: "10px" }}>
      {/* <h3>Orders ({orderCount})</h3> */}

      {loading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
          }}
        >
          <SpinLoading color="primary" />
        </div>
      ) : data.length > 0 ? (
        <>
          {data.map((order) => (
            <Card
              title={
                <div style={{ fontWeight: "small" }}>
                  Order Id: {order.order_id}
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
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <strong>{order?.customers?.name || "N/A"}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {order?.customers?.phone || "N/A"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <strong>Order Date: </strong>
                    {order.order_date ? `${order.order_date}` : "N/A"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 3,
                    }}
                  >
                    {/* Total Items */}
                    <div style={{ flex: 1, textAlign: "center", width: 80 }}>
                      <strong>Items: </strong>
                      {order.total_items || "N/A"}
                    </div>
                    {/* Total Amount */}
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        marginLeft: 15,
                      }}
                    >
                      <strong>Total: </strong>
                      {order.total_price ? `${order.total_price}` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <Divider></Divider>
              {/* Status and Assign */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "1rem",
                  margin: "0 16px",
                  flexWrap: "wrap",
                }}
              >
                {/* <div style={{ flex: 1, minWidth: "120px" }}> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flex: 1,
                    minWidth: "120px",
                  }}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Assign To"
                    value={order.m_id}
                    onChange={(value) =>
                      handleAssignOrder(order.order_id, value)
                    }
                  >
                    {members.map((member) => (
                      <Select.Option key={member.id} value={member.id}>
                        {member.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Tag
                    color="red"
                    style={{
                      fontWeight: "bold",
                      height: 33,
                      textAlign: "center",
                      paddingTop: 5,
                      width: "100%",
                    }}
                  >
                    {order.status}
                  </Tag>
                </div>
              </div>
              {/* Actions */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "right",
                  margin: "10px 55px 0 55px",
                  gap: "10px",
                  maxWidth: "100%",
                }}
                className="action-icons"
              >
                <EyeTwoTone
                  twoToneColor="#52c41a"
                  style={{ cursor: "pointer", fontSize: "16px" }}
                  onClick={() => handleOrderViewDetails(order.order_id)}
                />
                <EditOutlined
                  style={{
                    cursor: "pointer",
                    color: "#1890ff",
                    fontSize: "16px",
                  }}
                  onClick={() =>
                    order.customers.store === "Retail"
                      ? handleEditVisitClick(order.customers.id, order.order_id)
                      : handleEditWSVisitClick(
                          order.customers.id,
                          order.order_id
                        )
                  }
                />
                <DeleteOutlined
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "16px",
                  }}
                  onClick={() => showDeleteConfirm(order.order_id)}
                />
              </div>
            </Card>
          ))}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No Orders Found.</p>
      )}
    </div>
  );
}

export default SalesMobile;
