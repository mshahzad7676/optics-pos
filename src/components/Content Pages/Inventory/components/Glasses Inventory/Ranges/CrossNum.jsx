import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Typography, Button, Divider } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";

function CrossNum({ glassMinusRange, data, store }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { glass_type_id, glass_type } = useParams();
  const [form] = Form.useForm();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const range = glassMinusRange.split(" "); // e.g., ['+0.25', '/', '-0.50', 'to', '-2']
    const sph = range[0]; // Keep sph constant
    const startCyl = parseFloat(range[2]); // Starting cyl value (-0.50)
    const endCyl = parseFloat(range[4]); // Ending cyl value (-2.00)

    const rows = [];
    let cyl = startCyl;

    while (cyl >= endCyl) {
      const currentCyl = cyl; // Safe scoped copy

      const existingData = data.find(
        (item) =>
          parseFloat(item.sph) === parseFloat(sph) &&
          parseFloat(item.cyl) === parseFloat(currentCyl)
      );

      rows.push({
        id: existingData?.id,
        key: rows.length + 1,
        sph: parseFloat(sph).toFixed(2),
        cyl: currentCyl.toFixed(2),
        quantity: existingData ? existingData.held_quantity : "0",
        newQuantity: "0",
        price: existingData ? existingData.price : "0",
      });

      cyl -= 0.25;
    }

    setDataSource(rows);
  }, [glassMinusRange, data]);

  const handleNewQuantityChange = (key, value) => {
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        const currentQty = parseFloat(item.quantity);
        const previousQty = parseFloat(item.newQuantity);
        const newQty = parseFloat(value);

        if (!isNaN(newQty)) {
          const diff = newQty - previousQty;
          return {
            ...item,
            newQuantity: value,
            quantity: (currentQty + diff).toFixed(2),
          };
        }
        return { ...item, newQuantity: value };
      }
      return item;
    });

    setDataSource(newData);
  };

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

  const onFinish = async () => {
    const processedData = dataSource.map((item) => ({
      ...item,
      quantity: item.quantity || "0",
      price: item.price || "0",
    }));

    // console.log(processsedData, "Processed Data");
    // return;
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

  const renderFormRows = () =>
    dataSource.map((item) =>
      item.isDivider ? (
        <Divider key={`divider-${item.key}`} />
      ) : (
        <Row
          key={item.key}
          gutter={16}
          style={{ marginBottom: "10px", alignItems: "center" }}
        >
          <Col span={2}>
            <strong>+{item.sph}</strong>
          </Col>
          <Col span={2}>
            <strong>{item.cyl}</strong>
          </Col>
          <Col span={3}>
            <Input value={item.quantity} disabled />
          </Col>
          <Col span={3}>
            <Input
              value={item.newQuantity}
              onChange={(e) =>
                handleNewQuantityChange(item.key, e.target.value)
              }
              placeholder="Enter Quantity"
              type="number"
              step={0.5}
            />
          </Col>
          <Col span={3}>
            <Input
              value={item.price}
              onChange={(e) => handlePriceChange(item.key, e.target.value)}
              placeholder="Enter price"
            />
          </Col>
        </Row>
      )
    );

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
              <Col span={6}>
                <Typography.Title
                  level={2}
                  style={{
                    fontSize: 15,
                  }}
                >
                  Sph / Cyl
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
                  Held Qty.
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
                  Enter Qty.
                </Typography.Title>
              </Col>
              <Col span={5}>
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

            {dataSource.map((item) => {
              return item.isDivider ? (
                <Divider key={`divider-${Math.random()}`} />
              ) : (
                <Row
                  key={item.key}
                  gutter={16}
                  style={{ marginBottom: "10px" }}
                >
                  <Col span={6.5}>
                    <Row>
                      <Col>
                        <strong style={{ fontSize: 12 }}>{item.sph}</strong>
                      </Col>
                      /
                      <Col>
                        <strong style={{ fontSize: 12 }}>{item.cyl}</strong>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <Input
                      value={item.quantity}
                      disabled
                      // style={{ width: "100px" }}
                    />
                  </Col>
                  <Col span={5}>
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
              );
            })}
          </Form.Item>
          <Form.Item>
            <Row justify="center" style={{ marginTop: "10px" }}>
              <Col span={11}>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
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
            <Row
              gutter={8}
              style={{
                borderBottom: "1px solid #d9d9d9",
                marginBottom: 10,
              }}
            >
              <Col span={2}>
                <Typography.Text strong>Sph</Typography.Text>
              </Col>
              <Col span={2}>
                <Typography.Text strong>Cyl</Typography.Text>
              </Col>
              <Col span={3}>
                <Typography.Text strong>Held Qty.</Typography.Text>
              </Col>
              <Col span={3}>
                <Typography.Text strong>Enter Qty.</Typography.Text>
              </Col>
              <Col span={3}>
                <Typography.Text strong>Price</Typography.Text>
              </Col>
            </Row>
            {/* {renderFormRows()} */}

            {dataSource.map((item) => {
              return item.isDivider ? (
                <Divider key={`divider-${Math.random()}`} />
              ) : (
                <Row
                  key={item.key}
                  gutter={16}
                  style={{ marginBottom: "10px" }}
                >
                  <Col span={2}>
                    <strong>+{item.sph}</strong>
                  </Col>
                  <Col span={2}>
                    <strong>{item.cyl}</strong>
                  </Col>
                  <Col span={3}>
                    <Input
                      value={item.quantity}
                      disabled
                      style={{ width: "100px" }}
                    />
                  </Col>
                  <Col span={3}>
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
                  <Col span={3}>
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
              );
            })}
          </Form.Item>
          <Form.Item>
            <Row justify="center" style={{ marginTop: 20 }}>
              <Col span={isMobileView ? 22 : 11}>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                  style={{ width: isMobileView ? "100%" : 130 }}
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

export default CrossNum;
