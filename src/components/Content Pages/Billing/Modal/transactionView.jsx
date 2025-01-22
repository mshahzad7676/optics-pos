import React from "react";
import { Modal, Row, Col, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";

function TransactionViewModal({ open, onModalClose, transaction }) {
  const navigate = useNavigate();
  const closeModal = () => {
    onModalClose();
  };

  const handleHistoryViewClick = (id) => {
    navigate(`/view-visited-history/${id}`);
  };

  const handleOrderViewDetails = (id) => {
    navigate(`/orderdetails/${id}`);
    // navigate(`/orderdetails`, { state: { customer } });
  };

  return (
    <Modal
      title="View Transaction"
      open={open}
      onOk={closeModal}
      onCancel={closeModal}
    >
      {transaction ? (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <strong>Order ID: </strong>{" "}
            <Button
              type="link"
              onClick={() => {
                if (transaction.order_id) {
                  handleOrderViewDetails(transaction.order_id);
                }
              }}
              style={{ padding: 0, height: "auto" }}
            >
              {transaction.order_id || "N/A"}
            </Button>
          </Col>
          <Col span={12}>
            <strong>Customer Name: </strong>
            <Button
              type="link"
              onClick={() => handleHistoryViewClick(transaction.customers.id)}
              style={{ padding: 0, height: "auto" }}
            >
              {transaction.customers.name}
            </Button>
          </Col>
          <Col span={12}>
            <strong>Transaction ID: </strong> {transaction.id || "N/A"}
          </Col>
          <Col span={12}>
            <strong>Transaction Type: </strong>
            <Tag color={transaction.trans_type === "Credit" ? "green" : "red"}>
              {transaction.trans_type}
            </Tag>
          </Col>
          <Col span={12}>
            <strong>Total Amount: </strong>
            <span
              style={{
                color: transaction.trans_type === "Credit" ? "green" : "red",
              }}
            >
              {transaction.total_price}
            </span>
          </Col>
          <Col span={12}>
            <strong>Balance: </strong> {transaction.balance || "N/A"}
          </Col>
          <Col span={12}>
            <strong>Comments: </strong> {transaction.comments || "N/A"}
          </Col>
        </Row>
      ) : (
        <p>No transaction data available.</p>
      )}
    </Modal>
  );
}

export default TransactionViewModal;
