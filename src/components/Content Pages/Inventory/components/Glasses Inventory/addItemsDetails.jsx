import { Typography, Select, Col, Row, Spin, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { glassMinusRange, rangeData } from "../../../../../utils/constants";
import SphericalNum from "./Ranges/SphericalNum";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../api/Glasses Inventory/AdditemDetail";
import CylindericalNum from "./Ranges/CylindericalNum";
import Addition from "./Addition/Addition";
import { AppContext } from "../../../../SideNav";
import CrossNum from "./Ranges/CrossNum";

function AddItemDetails() {
  const { glass_type_id } = useParams();
  const [selectedRange, setSelectedRange] = useState("Plain to -2.00");
  const [data, setData] = useState([]);
  const { store } = useContext(AppContext);

  const handleRangeChange = (value) => {
    setSelectedRange(value || "");
  };

  useEffect(() => {
    // fetch data based on id and range
    if (!glass_type_id || !selectedRange) return;

    const fetchData = async () => {
      try {
        const response = await AdditemDetail.fetchDetails(
          glass_type_id,
          selectedRange,
          store.s_id
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

  const getComponentToRender = () => {
    if (!selectedRange) return null;
    if (selectedRange.includes(" / ")) {
      return (
        <CylindericalNum
          store={store}
          data={data}
          glassMinusRange={selectedRange}
        />
      );
    } else if (selectedRange.includes("Add")) {
      return (
        <Addition store={store} data={data} glassMinusRange={selectedRange} />
      );
    } else if (selectedRange.includes("`/`")) {
      return (
        <CrossNum
          store={store}
          data={data}
          glassMinusRange={selectedRange}
        ></CrossNum>
      );
    }
    return (
      <SphericalNum store={store} data={data} glassMinusRange={selectedRange} />
    );
  };

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
            allowClear
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
      {getComponentToRender()}
    </>
  );
}

export default AddItemDetails;
