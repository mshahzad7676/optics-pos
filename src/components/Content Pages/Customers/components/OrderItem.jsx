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

export default function OrderItem({
  onDelete,
  onChange,
  orderItem,
  onFinish,
  onCategoryChange,
  form,
  index,
  name,
  key,
}) {
  const selectedCategory = Form.useWatch(
    ["order_items", name, "category"],
    form
  );
  // useEffect(() => {
  //   console.log("selectedCategory", selectedCategory);
  // }, [selectedCategory]);

  // const handleCategoryChange = (value) => {
  //   onCategoryChange(value); // Notify parent of category change
  //   onChange({ category: value });
  //   // console.log(value);
  // };
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [orderItem, setOrderItem] = useState({ category: "eye_wear" });

  // const handleCategoryChange = (value) => {
  //   setSelectedCategory(value);
  // };

  // const handleOrderItemChange = (key, value) => {
  //   setOrderItem({
  //     ...orderItem,
  //     [key]: value,
  //   });
  // };
  // const handleCategoryChange = (value) => {
  //   setSelectedCategory(value);
  //   onChange({ category: value });
  // };
  // useEffect(() => {
  //   onChange(orderItem);
  // }, [orderItem, onChange]);

  const [glassTypes, setGlassTypes] = useState([]);
  const { store } = useContext(AppContext);
  console.log(store);

  useEffect(() => {
    if (selectedCategory === "Glasses Inventory") {
      fetchGlassType();
    }
  }, [selectedCategory]);

  // Function to fetch glass types
  // const fetchGlassTypes = async () => {
  //   try {
  //     const response = await GlassTypeApi.fetchGlassType(store.s_id);

  //     const { data } = response;

  //     if (data) {
  //       setGlassTypes(data);
  //     }
  //     // if (data && Array.isArray(data)) {
  //     //   const types = data.map((item) => item.glass_type);
  //     //   setGlassTypes(types);
  //     // }
  //   } catch (error) {
  //     console.error("Error fetching glass types:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchGlassTypes();
  // }, []);
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
      {/* Order Category */}
      {/* <Form
        form={form}
        key={key}
        onFinish={onFinish}
        layout="vertical"
        style={{ padding: "20px" }}
      > */}
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
              // onChange={(value) => handleOrderItemChange("category", value)}
              // onChange={handleCategoryChange}
              // optionFilterProp="label"
              // filterSort={(optionA, optionB) =>
              //   (optionA?.label ?? "")
              //     .toLowerCase()
              //     .localeCompare((optionB?.label ?? "").toLowerCase())
              // }
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
                {
                  value: "Glasses Inventory",
                  label: "Glasses Inventory",
                },
                {
                  value: "Custom Glasses",
                  label: "Custom Glasses",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* </Form> */}
      {/* {selectedCategory === "eye_wear" || selectedCategory === "sun_glasses" ? (
        <EyewearInfo key={key} onFinish={onFinish} form={form} />
      ) : selectedCategory === "contact_lense" ? (
        <ContactLenseInfo form={form} key={key} onFinish={onFinish} />
      ) : null} */}
      {selectedCategory === "Eye Wear" || selectedCategory === "Sun Glasses" ? (
        // <Form.List name={[name, 'frame']}>
        <EyewearInfo key={key} onFinish={onFinish} form={form} name={name} />
      ) : // </Form.List>
      selectedCategory === "Contact Lense" ? (
        <ContactLenseInfo
          form={form}
          onFinish={onFinish}
          key={key}
          name={name}
        />
      ) : selectedCategory === "Glasses Inventory" ? (
        <GlassesInfo
          form={form}
          onFinish={onFinish}
          key={key}
          name={name}
          glassTypes={glassTypes}
        ></GlassesInfo>
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
