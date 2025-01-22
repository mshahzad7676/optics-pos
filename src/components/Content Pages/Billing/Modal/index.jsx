import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  message,
  InputNumber,
} from "antd";
import CustomerAPI from "../../../../api/CustomerApi";
import TextArea from "antd/es/input/TextArea";
import TransactionApi from "../../../../api/TransactionApi";

function MakeTransaction({ open, onModalClose, Data, store }) {
  const [form] = Form.useForm();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transaction, setTransaction] = useState([]);

  // console.log(transaction, "in modal");

  const closeModal = () => {
    form.resetFields();
    setTransaction(null);
    onModalClose();
  };

  // Fetch transactions for the selected customer
  const fetchTransactionsForCustomer = async (customer_id) => {
    try {
      const result = await TransactionApi.fetchLatestTransaction(
        customer_id,
        store.s_id
      );

      setTransaction(result);
      console.log(result, "Latest transactions for customer");
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    if (store?.s_id && selectedCustomer) {
      fetchTransactionsForCustomer(selectedCustomer);
    }
  }, [store?.s_id, selectedCustomer]);

  const handleFormSubmit = () => {
    try {
      form.validateFields().then(async (values) => {
        const { trans_type, total_price, comments } = values;

        // Calculate the new balance based on the transaction type
        let updatedAmount = total_price;
        if (transaction) {
          if (trans_type === "Debit") {
            updatedAmount = transaction.balance - total_price;
          } else if (trans_type === "Credit") {
            updatedAmount = transaction.balance + total_price;
          }
        }

        const transactionPayload = {
          ...values,
          s_id: store.s_id,
          c_id: selectedCustomer,
          balance: updatedAmount,
        };
        console.log(transactionPayload, "submit");

        try {
          await TransactionApi.addTransaction(transactionPayload);
          message.success("Transaction added successfully!");
          closeModal();
        } catch (error) {
          console.error("Failed to add transaction:", error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        title="Add Transaction"
        open={open}
        // onOk={handleFormSubmit}
        onOk={() => form.submit()}
        onCancel={closeModal}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Customer Name"
                name="c_id"
                rules={[
                  { required: true, message: "Please Enter Customer Name" },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Customer Name"
                  optionFilterProp="label"
                  style={{ marginBottom: "10px" }}
                  onChange={(value) => {
                    console.log("Selected customer:", value);
                    setSelectedCustomer(value);
                    if (value) {
                      fetchTransactionsForCustomer(value);
                    } else {
                      setTransaction([]);
                    }
                  }}
                  options={Data?.map((customer) => ({
                    value: customer.id,
                    label: customer.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Transaction Type"
                name="trans_type"
                rules={[
                  { required: true, message: "Please Enter Transaction Type" },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Transaction Type"
                  optionFilterProp="label"
                  style={{ marginBottom: "10px", width: 200 }}
                  options={[
                    { value: "Credit", label: "Credit" },
                    { value: "Debit", label: "Debit" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Amount"
                name="total_price"
                rules={[{ required: true, message: "Please Enter Amount" }]}
              >
                <InputNumber
                  placeholder="Enter Amount"
                  style={{ width: 160 }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Comments" name="comments">
                <TextArea rows={3}> </TextArea>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default MakeTransaction;
