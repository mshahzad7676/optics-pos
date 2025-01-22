import React, { useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Row,
  Col,
  Radio,
  Space,
  message,
  Typography,
} from "antd";
import TransactionApi from "../../../../api/TransactionApi";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

function TransactionModal({
  open,
  onModalClose,
  customer_id,
  store,
  latestTransaction,
}) {
  // console.log(latestTransaction, "ll");
  const [form] = Form.useForm();
  const [remainingBalance, setRemainingBalance] = useState(0);

  const navigate = useNavigate();

  const closeModal = () => {
    onModalClose();
  };

  const handlePaymentChange = () => {
    const payType = form.getFieldValue("pay_type");
    const enteredAmount = form.getFieldValue("total_price") || 0;
    const totalOrderPrice = latestTransaction?.data?.[0]?.total_price || 0;
    let remainingBalance = 0;

    if (payType === 1) {
      // Full Payment
      form.setFieldsValue({
        paid: totalOrderPrice,
        remaining: 0,
      });
      remainingBalance = -totalOrderPrice;
    } else if (payType === 2) {
      // Partial Payment
      remainingBalance = totalOrderPrice - enteredAmount;

      form.setFieldsValue({
        paid: enteredAmount,
        remaining: remainingBalance > 0 ? remainingBalance : 0,
      });
    }

    setRemainingBalance(remainingBalance);
  };

  const handleFormSubmit = async (values) => {
    const { pay_type, total_price, paid, remaining, comments } = values;
    const currentBalance = latestTransaction?.data?.[0]?.balance || 0;
    const newBalance = currentBalance - paid;

    const transactionPayload = {
      s_id: store.s_id,
      c_id: customer_id,
      trans_type: "Debit",
      order_id: latestTransaction?.data?.[0]?.order_id,
      total_price: paid,
      balance: newBalance,
      comments: comments,
    };

    try {
      await TransactionApi.addTransaction(transactionPayload);
      message.success("Transaction added successfully!");

      closeModal();
      navigate(`/orderdetails/${latestTransaction?.data?.[0]?.order_id}`);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <Modal
      title="Add Transaction"
      open={open}
      onOk={() => form.submit()}
      onCancel={closeModal}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ padding: "20px" }}
        onValuesChange={handlePaymentChange}
      >
        <Row gutter={16}>
          {/* Payment Type */}
          <Col span={24}>
            <Form.Item
              label="Payment Type"
              name="pay_type"
              rules={[
                { required: true, message: "Please select Payment Type" },
              ]}
            >
              <Radio.Group>
                <Space direction="horizontal">
                  <Radio value={1}>Full Payment</Radio>
                  <Radio value={2}>Partial Payment</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* Entered Amount (only for Partial Payment) */}
          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {({ getFieldValue }) =>
              getFieldValue("pay_type") === 2 && (
                <Col span={24}>
                  <Form.Item
                    label="Entered Amount"
                    name="total_price"
                    rules={[
                      { required: true, message: "Please enter the amount" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter Amount"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )
            }
          </Form.Item>

          {/* Total Balance */}
          <Col span={24}>
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: "10px",
              }}
            >
              <span>Total Balance:</span>
              <strong style={{ marginLeft: "20px" }}>
                {latestTransaction?.data?.[0]?.total_price || 0}
              </strong>
            </Typography>
          </Col>

          {/* Paid Amount */}
          <Col span={10}>
            <Form.Item label="Paid Amount" name="paid">
              <InputNumber
                placeholder="Paid Amount"
                disabled
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {/* Remaining Balance (only for Partial Payment) */}
          <Form.Item shouldUpdate style={{ marginLeft: 10, marginBottom: 0 }}>
            {({ getFieldValue }) =>
              getFieldValue("pay_type") === 2 && (
                <Col span={24}>
                  <Form.Item label="Remaining Balance" name="remaining">
                    <InputNumber
                      placeholder="Remaining Balance"
                      disabled
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )
            }
          </Form.Item>
          <Col span={24}>
            <Form.Item label="Comments" name="comments">
              <TextArea rows={3} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default TransactionModal;
