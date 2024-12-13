import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Typography, Button, Divider } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";

function CylindericalNum({ glassMinusRange, data }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { glass_type_id } = useParams();
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (glassMinusRange === "Plain to -2.00 / 2") {
  //     const rows = [];
  //     let current = 0;
  //     let cyl = -0.25;
  //     while (cyl >= -2) {
  //       while (current >= -2) {
  //         const currentValue = current;
  //         const existingData = data.find(
  //           (item) => parseFloat(item.sph) === currentValue
  //         );

  //         rows.push({
  //           id: existingData?.id,
  //           key: rows.length + 1,
  //           sph: current === 0 ? "0.00" : current.toFixed(2),
  //           cyl: cyl === 0 ? "0.00" : cyl.toFixed(2),
  //           quantity: existingData ? existingData.held_quantity : "0",
  //           newQuantity: "0",
  //           price: existingData ? existingData.price : "0",
  //         });

  //         current -= 0.25;
  //       }
  //       current = 0;
  //       cyl -= 0.25;
  //     }
  //     setDataSource(rows);
  //   } else {
  //     setDataSource([]);
  //   }
  // }, [glassMinusRange, data]);

  useEffect(() => {
    const range = glassMinusRange.split(" "); // ['Plain', 'to', '-2.00', '/', '2'];
    const start = range[0] === "Plain" ? 0 : parseFloat(range[0]);
    const end = parseFloat(range[2]);
    const cylValue = parseFloat(range[4]);

    // if (glassMinusRange === "Plain to -2.00 / 2") {
    const rows = [];
    let current = start;
    let cyl = end < 0 ? -0.25 : 0.25;
    if (cyl <= 0) {
      while (cyl >= -cylValue) {
        while (current >= end) {
          const currentValue = current;
          const existingData = data.find(
            (item) => parseFloat(item.sph) === currentValue
          );

          rows.push({
            id: existingData?.id,
            key: rows.length + 1,
            sph: current === 0 ? "0.00" : current.toFixed(2),
            cyl: cyl === 0 ? "0.00" : cyl.toFixed(2),
            quantity: existingData ? existingData.held_quantity : "0",
            newQuantity: "0",
            price: existingData ? existingData.price : "0",
          });

          current -= 0.25;
        }
        rows.push({});
        current = start;
        cyl -= 0.25;
      }
    }
    if (cyl >= 0) {
      while (cyl <= cylValue) {
        while (current <= end) {
          const currentValue = current;
          const existingData = data.find(
            (item) => parseFloat(item.sph) === currentValue
          );

          rows.push({
            id: existingData?.id,
            key: rows.length + 1,
            sph: current === 0 ? "0.00" : `+${current.toFixed(2)}`,
            cyl: cyl === 0 ? "0.00" : `+${cyl.toFixed(2)}`,
            quantity: existingData ? existingData.held_quantity : "0",
            newQuantity: "0",
            price: existingData ? existingData.price : "0",
          });

          current += 0.25;
        }
        rows.push({});
        current = start;
        cyl += 0.25;
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
        glassMinusRange
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
    <Form form={form} onFinish={onFinish}>
      <Form.Item>
        <Row>
          <Col span={4}>
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
              Cyl
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
          <Col span={5}>
            <Typography.Title
              level={2}
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              Enter New Quantity
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
        {dataSource.map((item) => {
          return Object.keys(item).length ? (
            <Row key={item.key} gutter={16} style={{ marginBottom: "10px" }}>
              <Col span={4}>
                <strong>{item.sph}</strong>
              </Col>
              <Col span={4}>
                <strong>{item.cyl}</strong>
              </Col>
              <Col span={4}>
                <Input
                  value={item.quantity}
                  disabled
                  style={{ width: "100px" }}
                />
              </Col>
              <Col span={5}>
                <Input
                  value={item.newQuantity}
                  onChange={(e) =>
                    handleNewQuantityChange(item.key, e.target.value)
                  }
                  style={{ width: "100px" }}
                  placeholder="Enter new quantity"
                  type="number"
                />
              </Col>
              <Col span={4}>
                <Input
                  value={item.price}
                  onChange={(e) => handlePriceChange(item.key, e.target.value)}
                  style={{ width: "100px" }}
                  placeholder="Enter price"
                />
              </Col>
            </Row>
          ) : (
            <Divider />
          );
        })}
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
  );
}

export default CylindericalNum;
