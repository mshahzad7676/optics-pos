import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Typography, Button, Divider } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";
import priceList from "../../../../../../api/Price List/PriceListApi";

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
          <Col span={isMobileView ? 6 : 2}>
            <strong>+{item.sph}</strong>
          </Col>
          <Col span={isMobileView ? 6 : 2}>
            <strong>{item.cyl}</strong>
          </Col>

          <Col span={isMobileView ? 6 : 3}>
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
    <Form form={form} onFinish={onFinish}>
      <Form.Item>
        <Row
          gutter={8}
          style={{
            borderBottom: "1px solid #d9d9d9",
            marginBottom: 10,
          }}
        >
          <Col span={isMobileView ? 6 : 2}>
            <Typography.Text strong>Sph</Typography.Text>
          </Col>
          <Col span={isMobileView ? 6 : 2}>
            <Typography.Text strong>Cyl</Typography.Text>
          </Col>

          <Col span={isMobileView ? 6 : 3}>
            <Typography.Text strong>Price</Typography.Text>
          </Col>
        </Row>
        {renderFormRows()}
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
              Update Price
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

export default CrossNum;
