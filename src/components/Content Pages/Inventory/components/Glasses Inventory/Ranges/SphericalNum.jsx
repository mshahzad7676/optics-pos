import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Row, Col, Typography, Button } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";
import { AppContext } from "../../../../../SideNav";

function SphericalNum({ glassMinusRange, data, store }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { glass_type_id, glass_type } = useParams();
  const [form] = Form.useForm();
  // const { store } = useContext(AppContext);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const range = glassMinusRange.split(" "); // ['Plain', 'to', '-2.00'];
    const start = range[0] === "Plain" ? 0 : parseFloat(range[0]);
    const end = parseFloat(range[2]);

    // if (glassMinusRange === "Plain to -2.00") {
    const rows = [];
    let current = start;

    if (end <= 0) {
      // negative range
      while (current >= end) {
        const currentValue = current;
        const existingData = data.find(
          (item) => parseFloat(item.sph) === currentValue
        );

        rows.push({
          id: existingData?.id,
          key: rows.length + 1,
          sph: current === 0 ? "0.00" : current.toFixed(2),
          quantity: existingData ? existingData.held_quantity : "0",
          newQuantity: "0",
          price: existingData ? existingData.price : "0",
        });

        current -= 0.25;
      }
    }
    if (end >= 0) {
      // positive range
      while (current <= end) {
        const currentValue = current;
        const existingData = data.find(
          (item) => parseFloat(item.sph) === currentValue
        );

        rows.push({
          id: existingData?.id,
          key: rows.length + 1,
          sph: current === 0 ? "0.00" : current.toFixed(2),
          quantity: existingData ? existingData.held_quantity : "0",
          newQuantity: "0",
          price: existingData ? existingData.price : "0",
        });

        current += 0.25;
      }
    }

    setDataSource(rows);
    // } else {
    //   setDataSource([]);
    // }
  }, [glassMinusRange, data]);

  // Handle quantity change
  const handleNewQuantityChange = (key, value) => {
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        const currentQuantity = parseFloat(item.quantity);
        const previousNewQuantity = parseFloat(item.newQuantity);
        const newQuantity = parseFloat(value);

        if (!isNaN(newQuantity)) {
          const difference = newQuantity - previousNewQuantity;
          return {
            ...item,
            newQuantity: value,
            quantity: (currentQuantity + difference).toFixed(2),
          };
        } else {
          return { ...item, newQuantity: value };
        }
      }
      return item;
    });
    setDataSource(newData);
  };

  // Handle price change
  const handlePriceChange = (key, value) => {
    const newData = dataSource.map((item) => {
      // if (item.key === key) {
      //   return { ...item, price: value };
      // }
      return {
        ...item,
        price: value,
      };
    });
    setDataSource(newData);
  };

  // Handle form submission
  const onFinish = async () => {
    // const isValid = dataSource.every(
    //   (item) =>
    //     item.newQuantity &&
    //     !isNaN(parseFloat(item.newQuantity)) &&
    //     item.price &&
    //     !isNaN(parseFloat(item.price))
    // );

    const processedData = dataSource.map((item) => ({
      ...item,
      quantity: item.quantity || "0",
      price: item.price || "0",
    }));

    // console.log(processsedData, "Processed Data");

    setLoading(true);

    try {
      await AdditemDetail.addDetails(
        processedData,
        glass_type_id,
        glass_type,
        glassMinusRange,
        store.s_id
      );
      console.log("Data successfully saved to the database!");
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isMobileView ? (
        <Form form={form} onFinish={onFinish}>
          <Form.Item>
            <Row
              style={{
                borderBottom: "1px solid #d9d9d9",
                marginBottom: 5,
              }}
              gutter={16}
            >
              <Col span={4}>
                <Typography.Title
                  level={2}
                  style={{
                    // fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Sph
                </Typography.Title>
              </Col>
              <Col span={7}>
                <Typography.Title
                  level={2}
                  style={{
                    // fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Held Qty.
                </Typography.Title>
              </Col>
              <Col span={7}>
                <Typography.Title
                  level={2}
                  style={{
                    // fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Enter Qty.
                </Typography.Title>
              </Col>
              <Col span={6}>
                <Typography.Title
                  level={2}
                  style={{
                    // fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Price
                </Typography.Title>
              </Col>
            </Row>
            {dataSource.map((item) => (
              <Row
                key={item.key}
                gutter={16}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  // alignItems: "flex-start",
                }}
              >
                <Col span={3}>
                  <strong>{item.sph}</strong>
                </Col>
                <Col span={7}>
                  <Input
                    value={item.quantity}
                    disabled
                    // style={{ width: "100px" }}
                  />
                </Col>
                <Col span={7}>
                  <Input
                    value={item.newQuantity}
                    onChange={(e) =>
                      handleNewQuantityChange(item.key, e.target.value)
                    }
                    // style={{ width: "100px" }}
                    placeholder="Enter Quantity"
                    type="number"
                    step={0.5}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    value={item.price}
                    onChange={(e) =>
                      handlePriceChange(item.key, e.target.value)
                    }
                    // style={{ width: "100px" }}
                    placeholder="Enter price"
                  />
                </Col>
              </Row>
            ))}
          </Form.Item>
          <Form.Item>
            <Row justify="center" style={{ marginTop: "10px" }}>
              <Col span={11}>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  // style={{ width: 130 }}
                  style={{ width: "100%" }}
                  loading={loading}
                >
                  Add Quantity
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      ) : (
        <Form form={form} onFinish={onFinish}>
          <Form.Item>
            <Row>
              <Col span={2}>
                <Typography.Title
                  level={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  Sph
                </Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title
                  level={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  Held Quantity
                </Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title
                  level={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  Enter Quantity
                </Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title
                  level={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  Price
                </Typography.Title>
              </Col>
            </Row>
            {dataSource.map((item) => (
              <Row key={item.key} gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={2}>
                  <strong>{item.sph}</strong>
                </Col>
                <Col span={4}>
                  <Input
                    value={item.quantity}
                    disabled
                    style={{ width: "100px" }}
                  />
                </Col>
                <Col span={4}>
                  <Input
                    value={item.newQuantity}
                    onChange={(e) =>
                      handleNewQuantityChange(item.key, e.target.value)
                    }
                    style={{ width: "100px" }}
                    placeholder="Enter Quantity"
                    type="number"
                    step={0.5}
                  />
                </Col>
                <Col span={4}>
                  <Input
                    value={item.price}
                    onChange={(e) =>
                      handlePriceChange(item.key, e.target.value)
                    }
                    style={{ width: "100px" }}
                    placeholder="Enter price"
                  />
                </Col>
              </Row>
            ))}
          </Form.Item>
          <Form.Item>
            <Row justify="center" style={{ marginTop: "30px" }}>
              <Col span={11}>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  style={{ width: 130 }}
                  loading={loading}
                >
                  Add Quantity
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

export default SphericalNum;
