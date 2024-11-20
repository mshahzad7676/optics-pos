import React from "react";
import { Row, Col, Select, Card, Button, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import EyewearInfo from "./eyewearinfo";
import ContactLenseInfo from "./contactlensinfo";

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
                width: 300,
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
      ) : null}
    </Card>
  );
}
