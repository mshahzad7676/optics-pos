import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Select, Card, Button, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import EyewearInfo from "./eyewearinfo";
import ContactLenseInfo from "./contactlensinfo";
import GlassesInfo from "./glassesInfo";
import CustomOrder from "./customOrder";
import AdditemDetail from "../../../../api/Glasses Inventory/AdditemDetail";
import GlassTypeApi from "../../../../api/Glasses Inventory/GlassTypeApi";
import { AppContext } from "../../../SideNav";
import GlassesInfoNew from "./glassesInfoNew";

export default function OrderItem({
  onDelete,
  onFinish,
  form,
  name,
  key,
  orderItem,
}) {
  const selectedCategory = Form.useWatch(
    ["order_items", name, "category"],
    form
  );

  const [glassTypes, setGlassTypes] = useState([]);
  const { store } = useContext(AppContext);
  // console.log(store);

  useEffect(() => {
    if (selectedCategory === "Glasses Inventory") {
      fetchGlassType();
    }
  }, [selectedCategory]);

  async function fetchGlassType() {
    try {
      const types = await GlassTypeApi.fetchGlassType("", store.s_id);
      // console.log(item, "sum wala");

      if (types) {
        setGlassTypes(types);
      }
    } catch (error) {
      console.error("Failed to fetch Items:", error);
    }
  }
  useEffect(() => {
    if (store?.s_id) {
      fetchGlassType();
    }
  }, [store?.s_id]);

  return (
    <Card
      style={{ marginTop: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
      title="Order Item"
      extra={
        <Button
          color="danger"
          variant="filled"
          size="middle"
          onClick={onDelete}
        >
          <DeleteOutlined /> Delete
        </Button>
      }
    >
      <Row gutter={16}>
        <Col span={7}>
          <Form.Item label="Order Category" name={[name, "category"]}>
            <Select
              // showSearch
              style={{
                width: 250,
              }}
              placeholder="Select Category"
              defaultValue={selectedCategory}
              options={[
                {
                  value: "Eye Wear",
                  label: "Eye Wear Glasses",
                },
                {
                  value: "Contact Lense",
                  label: "Contact Lense",
                },
                {
                  value: "Sun Glasses",
                  label: "Sun Glasses",
                },
                // {
                //   value: "Glasses Inventory",
                //   label: "Glasses Inventory",
                // },
                // {
                //   value: "Custom Glasses",
                //   label: "Custom Glasses",
                // },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      {selectedCategory === "Eye Wear" || selectedCategory === "Sun Glasses" ? (
        <EyewearInfo
          key={key}
          onFinish={onFinish}
          form={form}
          name={name}
          orderItem={orderItem}
        />
      ) : selectedCategory === "Contact Lense" ? (
        <ContactLenseInfo
          form={form}
          onFinish={onFinish}
          key={key}
          name={name}
        />
      ) : selectedCategory === "Glasses Inventory" ? (
        // <GlassesInfo
        //   form={form}
        //   onFinish={onFinish}
        //   key={key}
        //   name={name}
        //   glassTypes={glassTypes}
        // ></GlassesInfo>
        <GlassesInfoNew
          form={form}
          onFinish={onFinish}
          key={key}
          name={name}
          glassTypes={glassTypes}
        ></GlassesInfoNew>
      ) : selectedCategory === "Custom Glasses" ? (
        <CustomOrder
          name={name}
          form={form}
          onFinish={onFinish}
          key={key}
        ></CustomOrder>
      ) : null}
    </Card>
  );
}
