import React, { useState, useEffect } from "react";

import { Typography, Select, Col, Row, Table } from "antd";
import { useParams } from "react-router-dom";
import AdditemDetail from "../../../../../../api/Glasses Inventory/AdditemDetail";
import { glassMinusRange } from "../../../../../../utils/constants";

function ViewItemDetails() {
  const [rangeData, setRangeData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [selectedRangeFilter, setSelectedRangeFlter] = useState(undefined);

  useEffect(() => {
    const ranges = {};
    glassMinusRange.forEach((range) => {
      ranges[range.value] = [];
    });
    setRangeData(ranges);
  }, []);

  // fetch all data by filters
  useEffect(() => {
    async function fetchData() {
      try {
        const filter =
          selectedRangeFilter === "All" || !selectedRangeFilter
            ? undefined
            : selectedRangeFilter;
        const { success, data } = await AdditemDetail.fetchAllDetails(filter);
        setItemData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemData([]);
      }
    }
    fetchData();
  }, [selectedRangeFilter]);

  const handleRangeChange = (value) => {
    setSelectedRangeFlter(value);
  };
  const columns = [
    // {
    //   title: "id",
    //   dataIndex: "id",
    // },
    // {
    //   title: "Range",
    //   dataIndex: "range",
    // },
    {
      title: "Sph",
      dataIndex: "sph",
    },
    {
      title: "Cyl",
      dataIndex: "cyl",
      hidden: selectedRangeFilter && !selectedRangeFilter?.includes("/"),
    },
    {
      title: "Addition",
      dataIndex: "addition",
      hidden: selectedRangeFilter && !selectedRangeFilter?.includes("Add"),
    },
    {
      title: "Quantity",
      dataIndex: "held_quantity",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.held_quantity - b.held_quantity,
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ];
  return (
    <>
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col>
          <Select
            showSearch
            allowClear
            defaultValue="All"
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

      <h2 style={{ marginTop: 25 }}>
        {selectedRangeFilter ? `Range: ${selectedRangeFilter}` : "All Items"}
      </h2>
      <Table
        columns={columns}
        pagination={false}
        rowKey="id"
        dataSource={itemData}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
export default ViewItemDetails;
