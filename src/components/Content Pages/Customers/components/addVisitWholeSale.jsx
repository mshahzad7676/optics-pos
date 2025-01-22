import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row } from "antd";

import TransactionModal from "./transactionModal";
import { AppContext } from "../../../SideNav";

import OrderApi from "../../../../api/OrderApi";
import WholeSaleRow from "./wholesaleOrder";
import TransactionApi from "../../../../api/TransactionApi";
import { calculateOrderAmount } from "../../../../utils/helpers";

function AddVisitWholeSale() {
  const [form] = Form.useForm();
  const { user, store } = useContext(AppContext);
  const { customer_id, order_id } = useParams();
  const [ModalOpen, setModalOpen] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [currentOrderAmount, setCurrentOrderAmount] = useState(0);

  const navigate = useNavigate();

  const showModal = () => {
    setModalOpen(true);
  };

  // fetch order details for update
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order_id) {
        try {
          const data = await OrderApi.fetchOrderItemDetails(order_id);
          console.log(data, "update");
          if (data) {
            const transformedOrderItems = data.order_items.map((item) => {
              // const glass = item.order_item_object?.glass || {};
              return {
                order_id: item.order_id,
                order_item_id: item.order_item_id,
                category: item.category,
                ...item.order_item_object,
              };
            });
            console.log("transformedOrderItems", transformedOrderItems);
            // Set transformed data to the form
            form.setFieldsValue({ order_items: transformedOrderItems });
            const OrderAmount = calculateOrderAmount(transformedOrderItems);
            setCurrentOrderAmount(OrderAmount);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };

    fetchOrderDetails();
  }, [order_id, form]);

  //fetch latest transaction of order
  const fetchLatestTransaction = async () => {
    try {
      const transaction = await TransactionApi.fetchLatestTransaction(
        customer_id,
        store.s_id
      );
      if (transaction) {
        setLatestTransaction(transaction);
        console.log("Fetched Latest Transaction:", transaction);
      } else {
        console.log("No previous transaction found. Setting balance to 0.");
        setLatestTransaction({ balance: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch the latest transaction:", error);
      setLatestTransaction({ balance: 0 });
    }
  };

  useEffect(() => {
    if (customer_id) {
      fetchLatestTransaction();
    }
  }, [customer_id, store?.s_id]);

  // Make Transaction
  const orderTransaction = async (orderId, values) => {
    const transcationPayload = {
      order_id: orderId ? parseInt(orderId) : undefined,
      c_id: parseInt(customer_id),
      s_id: store?.s_id,
      trans_type: "",
    };

    try {
      let totalPrice = calculateOrderAmount(values.order_items);
      totalPrice = totalPrice - currentOrderAmount;
      transcationPayload.trans_type = totalPrice < 0 ? "Debit" : "Credit";
      const currentBalance = latestTransaction?.balance || 0;
      transcationPayload.total_price = totalPrice;
      const newBalance = currentBalance + totalPrice;
      transcationPayload.balance = newBalance;

      // Add transaction
      const data = await TransactionApi.addTransaction(transcationPayload);
      console.log("Transaction created:", data);
      setTransactionData(data);
      return data;
    } catch (error) {
      console.error("Error processing Transaction:", error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    console.log(values, "finish");

    const payload = {
      order_id: order_id ? parseInt(order_id) : undefined,
      c_id: parseInt(customer_id),
      order_items: values.order_items.map((item) => ({
        ...item,
        // category: "Glasses",
      })),
      s_id: store?.s_id,
    };
    // console.log("payload -->", payload);

    try {
      // First, send the order data to OrderApi
      const data = await OrderApi.addOrder(payload);
      console.log("Order created:", data);
      if (data?.orderData?.[0]?.order_id) {
        //Call the orderTranscation
        const transcationResponse = await orderTransaction(
          data.orderData?.[0]?.order_id,
          values
        );
        // check on transaction type and show modal
        if (transcationResponse?.data?.[0].trans_type === "Credit") {
          showModal();
        } else if (transcationResponse?.data?.[0].trans_type === "Debit") {
          navigate(`/orderdetails/${data.orderData?.[0]?.order_id}`);
        }
      }
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "16px" }}
      >
        <h2 style={{ margin: 0 }}>
          {order_id ? "Edit" : "Add"} Customer Visit Details
        </h2>

        {/* <Button type="primary" shape="round-large" onClick={handleSave}> */}
        <Button
          type="primary"
          shape="round-large"
          onClick={() => {
            form.submit();
            // showModal();
          }}
        >
          Save
        </Button>
        <TransactionModal
          open={ModalOpen}
          store={store}
          latestTransaction={transactionData}
          customer_id={customer_id}
          onModalClose={() => setModalOpen(false)}
        ></TransactionModal>
      </Row>

      <WholeSaleRow form={form} onFinish={onFinish}></WholeSaleRow>
    </>
  );
}

export default AddVisitWholeSale;
