import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Typography, Button } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";
import { useContext } from "react";
import { AppContext } from "../../../../../SideNav";
import priceList from "../../../../../../api/Price List/PriceListApi";

function Addition({ glassMinusRange, data, store }) {
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
    const range = glassMinusRange.split(" "); // ['Plain' 'to', '+3.00', 'Add','+1.00'];
    // console.log(range);
    const start = range[0] === "Plain" ? 0 : parseFloat(range[0]);
    const end = parseFloat(range[2]);
    const addvalue = parseFloat(range[4]);
    // if (glassMinusRange === "+1.00 to +3.00 Add +1.00") {
    const rows = [];
    let current = start;
    if (current >= 0) {
      while (current <= end) {
        const currentValue = current;
        const existingData = data.find(
          (item) => parseFloat(item.sph) === currentValue
        );

        rows.push({
          id: existingData?.id,
          key: rows.length + 1,
          sph: current === 0 ? "0.00" : `+${current.toFixed(2)}`,
          add: `+${addvalue.toFixed(2)}`,
          // add: "100",
          quantity: existingData ? existingData.held_quantity : "0",
          newQuantity: "0",
          price: existingData ? existingData.price : "0",
        });

        current += 0.25;
      }
    }
    if (current <= 0) {
      while (current >= end) {
        const currentValue = current;
        const existingData = data.find(
          (item) => parseFloat(item.sph) === currentValue
        );

        rows.push({
          id: existingData?.id,
          key: rows.length + 1,
          sph: current === 0 ? "0.00" : current.toFixed(2),
          add: `+${addvalue.toFixed(2)}`,
          // add: "100",
          quantity: existingData ? existingData.held_quantity : "0",
          newQuantity: "0",
          price: existingData ? existingData.price : "0",
        });

        current -= 0.25;
      }
    }

    setDataSource(rows);
    // } else {
    //   setDataSource([]);
    // }
  }, [glassMinusRange, data]);

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
      // quantity: item.quantity || "0",
      price: item.price || "0",
    }));

    // console.log(processsedData, "Processed Data");

    setLoading(true);
    try {
      await priceList.additemPrice(
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
              gutter={8}
              style={{
                borderBottom: "1px solid #d9d9d9",
                marginBottom: 5,
              }}
            >
              <Col span={8}>
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
              <Col span={8}>
                <Typography.Title
                  level={2}
                  style={{
                    // fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Add
                </Typography.Title>
              </Col>

              <Col span={8}>
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
              <Row key={item.key} gutter={12} style={{ marginBottom: "10px" }}>
                <Col span={8}>
                  <strong>{item.sph}</strong>
                </Col>
                <Col span={8}>
                  <strong>{item.add}</strong>
                </Col>

                <Col span={8}>
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
            <Row justify="center">
              <Col span={11}>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  style={{ width: "100%" }}
                  loading={loading}
                >
                  Update Price
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
              <Col span={3}>
                <Typography.Title
                  level={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  Addition
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
                <Col span={3}>
                  <strong>{item.add}</strong>
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
            <Row justify="center" style={{ width: 350 }}>
              <Col span={11}>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  style={{ width: 180 }}
                  loading={loading}
                >
                  Update Price
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

export default Addition;
