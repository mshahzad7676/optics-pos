import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Flex } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import OrderItem from "./OrderItem";
import { useNavigate } from "react-router-dom";
import OrderApi from "../../../../api/OrderApi";
import { AppContext } from "../../../SideNav";
import TranscationApi from "../../../../api/TranscationApi";

function AddVisitCustomer() {
  const [form] = Form.useForm();
  const [orderItems, setOrderItems] = useState([{}]);
  const [hover, setHover] = useState(false);
  const { user, store } = useContext(AppContext);

  const navigate = useNavigate();
  const { customer_id, order_id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order_id) {
        try {
          const data = await OrderApi.fetchOrderItemDetails(order_id);

          if (data) {
            const transformedOrderItems = data.order_items.map((item) => ({
              order_id: item.order_id,
              category: item.category,
              order_item_id: item.order_item_id,
              ...item.order_item_object,
            }));
            form.setFieldsValue({ order_items: transformedOrderItems });
            // setOrderItems(transformedOrderItems);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };

    fetchOrderDetails();
  }, [order_id, form]);

  const handleCategoryChange = (value, index) => {
    const updatedItems = [...orderItems];
    updatedItems[index].category = value;
    setOrderItems(updatedItems);
  };

  const orderTranscation = async (orderId, values) => {
    const transcationPayload = {
      order_id: orderId ? parseInt(orderId) : undefined,
      c_id: parseInt(customer_id),
      order_items: values.order_items,
      s_id: store?.s_id,
    };
    try {
      const data = await TranscationApi.addTranscation(transcationPayload);
      console.log("Transcation created:", data);
      // navigate(`/orderdetails/${data.orderData?.[0]?.order_id}`);
    } catch (error) {
      console.error("Error processing Transcation:", error);
    }
  };

  const onFinish = async (values) => {
    const payload = {
      order_id: order_id ? parseInt(order_id) : undefined, // Order ID from URL,
      c_id: parseInt(customer_id),
      order_items: values.order_items,
      s_id: store?.s_id,
    };
    // console.log(payload);

    try {
      // First, send the order data to OrderApi
      const data = await OrderApi.addOrder(payload);
      console.log("Order created:", data);

      navigate(`/orderdetails/${data.orderData?.[0]?.order_id}`);

      //Call the orderTranscation
      await orderTranscation(data?.order_id, values);
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "16px" }}
      >
        <h2 style={{ margin: 0 }}>
          {order_id ? "Edit" : "Add"} Customer Visit Details
        </h2>

        <div style={{ gap: "10px", display: "flex", alignItems: "center" }}>
          <Button
            type="primary"
            shape="round-large"
            onClick={() => form.submit()}
          >
            Save
          </Button>
        </div>
      </Flex>

      <Content>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ order_items: [{ category: "Eye Wear" }] }}
        >
          <Form.List name="order_items">
            {(orderItems, { add, remove }) => (
              <>
                {orderItems.map((orderItem, index) => (
                  <OrderItem
                    key={index}
                    onDelete={() => remove(index)}
                    form={form}
                    name={orderItem.name}
                    orderItem={orderItem}
                    onFinish={onFinish}
                    onCategoryChange={(value) =>
                      handleCategoryChange(value, index)
                    }
                    onChange={(data) => {
                      const updatedItems = [...orderItems];
                      updatedItems[index] = {
                        ...updatedItems[index],
                        ...data,
                      };
                      setOrderItems(updatedItems);
                    }}
                  />
                ))}
                <Flex justify="center">
                  <Button
                    variant="filled"
                    size="middle"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => add({ category: "Eye Wear" })}
                    style={{
                      color: "#52c41a",
                      border: 0,
                      marginTop: 20,
                      backgroundColor: hover
                        ? "rgb(82 196 26 / 0.25)"
                        : "rgb(82 196 26 / 0.15)",
                    }}
                  >
                    <PlusSquareTwoTone twoToneColor="#52c41a" /> Add Section
                  </Button>
                </Flex>
              </>
            )}
          </Form.List>
        </Form>
      </Content>
    </>
  );
}

export default AddVisitCustomer;
