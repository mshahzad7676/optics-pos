import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../SideNav";
import TransactionApi from "../../../api/TransactionApi";
import { useNavigate } from "react-router-dom";
import { Card, Modal, SpinLoading, Toast } from "antd-mobile";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import TransactionViewModal from "../../Content Pages/Billing/Modal/transactionView";
import { Button, Tag } from "antd";

function BillingList({ selectedCustomer, searchTerm }) {
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState([]);
  const { user, store } = useContext(AppContext);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
      Toast.show({
        content: "Error Fetching Transaction data",
        position: "bottom",
      });
    } finally {
      setLoading(false);
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

  const showDeleteConfirm = (transId) => {
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
            Are you sure you want to Delete Transaction: {transId}?
          </div>
        </>
      ),
      closeOnMaskClick: true,
      confirmText: "Yes, Delete",
      confirmType: "danger",
      cancelText: "No",
      onConfirm: () => handleDelete(transId),
      onCancel() {},
    });
  };

  return (
    <>
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
      ) : transaction.length > 0 ? (
        <>
          {transaction.map((trans) => (
            <Card
              title={
                <div style={{ fontWeight: "small" }}>
                  Transaction ID: {trans.id}
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
                  marginBottom: 10,
                  // alignItems: "center",
                }}
              >
                {/* Order Id */}
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
                    {/* <strong>{trans?.order_id || "N/A"}</strong> */}
                    <Button
                      type="link"
                      onClick={() => {
                        if (trans.order_id) {
                          handleOrderViewDetails(trans.order_id);
                        }
                      }}
                      style={{ padding: 0, height: "auto" }}
                    >
                      {trans.order_id || "N/A"}
                    </Button>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {/* {trans?.customers.name || "N/A"} */}
                    <Button
                      type="link"
                      onClick={() => handleHistoryViewClick(trans.customers.id)}
                      style={{ padding: 0, height: "auto" }}
                    >
                      {trans.customers.name || "{N/A}"}
                    </Button>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {trans.customers?.phone || "N/A"}
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
                  {/* Total Amount */}
                  <div style={{ flex: 1, textAlign: "center", width: 80 }}>
                    <strong>Total Amount: </strong>
                    <br></br>
                    <span
                      style={{
                        color: trans.trans_type === "Credit" ? "green" : "red",
                      }}
                    >
                      {trans.total_price}
                    </span>
                  </div>
                  {/* balance */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      // marginLeft: 20,
                    }}
                  >
                    <strong>Balance: </strong>
                    <br></br>
                    {trans.balance || "N/A"}
                  </div>
                </div>
                {/* </div> */}
              </div>

              {/* transaction type  */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Tag
                  style={{
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                  color={trans.trans_type === "Credit" ? "green" : "red"}
                >
                  {trans.trans_type}
                </Tag>
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
                  onClick={() => showViewModal(trans)}
                />

                <EditOutlined
                  style={{
                    cursor: "pointer",
                    color: "#1890ff",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  // onClick={() => showEditModal(customer)}
                />

                <DeleteOutlined
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "16px",
                    minWidth: "16px",
                  }}
                  onClick={() => showDeleteConfirm(trans.id)}
                />
              </div>
            </Card>
          ))}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          No Transaction Found.
        </p>
      )}
      <TransactionViewModal
        open={isModalOpen}
        transaction={selectedTransaction}
        onModalClose={handleModalClose}
      ></TransactionViewModal>
    </>
  );
}
export default BillingList;
