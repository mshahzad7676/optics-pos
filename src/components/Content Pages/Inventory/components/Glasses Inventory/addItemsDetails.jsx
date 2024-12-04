import { Typography, Select, Col, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { glassMinusRange, rangeData } from "../../../../../utils/constants";
import Plnto2 from "./Minus Ranges/plnto2";
import { useParams } from "react-router-dom";
import PlaintoMinus2 from "../../../../../api/Glasses Inventory/Minus Ranges/plnto2";

function AddItemDetails() {
  const { glass_type_id } = useParams();
  const [selectedRange, setSelectedRange] = useState("Plain to -2.00");
  const [data, setData] = useState([]);

  const handleRangeChange = (value) => {
    setSelectedRange(value);
  };

  useEffect(() => {
    // fetch data based on id and range
    if (!glass_type_id || !selectedRange) return;

    const fetchData = async () => {
      try {
        const response = await PlaintoMinus2.fetchDetails(
          glass_type_id,
          selectedRange
        );
        if (response.success) {
          setData(response.data);
        } else {
          console.log("Failed to fetch data: " + response.error);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [glass_type_id, selectedRange]);

  return (
    <>
      <Typography.Title
        level={2}
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Add Item Quantity
      </Typography.Title>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col>
          <Select
            showSearch
            defaultValue="Plain to -2.00"
            placeholder="Select Range "
            optionFilterProp="label"
            options={glassMinusRange}
            onChange={handleRangeChange}
            style={{
              fontSize: "14px",
              width: 210,
            }}
          />
        </Col>
      </Row>

      {selectedRange === "Plain to -2.00" && (
        <Plnto2 data={data} glassMinusRange={selectedRange} />
      )}
    </>
  );
}

export default AddItemDetails;
