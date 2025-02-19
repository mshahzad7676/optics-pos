import React, { useState, useEffect } from "react";

import { Button, Select, Row, Input, Col } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import WholesaleApi from "../../../api/wholesaleApi";
import WholesaleTable from "./components/wholesaleTable";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function Wholesalers() {
  const [data, setData] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  async function fetchAllStores() {
    const filters = {
      city: searchCity,
      type: searchType,
      name: searchName,
    };
    try {
      const { data } = await WholesaleApi.fetchAllStore(filters);

      if (data) {
        // const { store } = data;
        setData(data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch Frames:", error);
      setData([]);
    }
  }

  useEffect(() => {
    fetchAllStores();
  }, [searchCity, searchName, searchType]);

  const uniqueCities = Array.from(
    new Set(data?.map((store) => store.city).filter((city) => city))
  );
  const options = uniqueCities.map((city) => ({
    value: city,
    label: city,
  }));

  const handleSearchCityChange = (value) => {
    setSearchCity(value);
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
  };

  const handleSearchNameChange = (value) => {
    setSearchName(value);
  };

  const handleResetFilters = () => {
    setSearchType("");
    setSearchCity("");
    setSearchName("");
    fetchAllStores();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>All Shops</h2>
      </div>
      <Row gutter={16}>
        <Col>
          <Select
            allowClear
            showSearch
            value={searchCity || undefined}
            onChange={handleSearchCityChange}
            placeholder="City"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 200,
            }}
            options={options}
          />
        </Col>
        <Col>
          <Select
            allowClear
            showSearch
            value={searchType || undefined}
            onChange={handleSearchTypeChange}
            placeholder="Category"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 200,
            }}
            options={[
              { value: "Retail", label: "Retail" },
              { value: "Wholesale", label: "Wholesale" },
              { value: "Retail & Wholesale", label: "Retail & Wholesale" },
            ]}
          />
        </Col>
        <Col>
          <Select
            allowClear
            showSearch
            value={searchName || undefined}
            onChange={handleSearchNameChange}
            placeholder="Name"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 230,
            }}
            options={data?.map((store) => ({
              value: store.name,
              label: store.name,
            }))}
          />
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            color="danger"
            variant="solid"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>
      <br></br>
      <WholesaleTable data={data}></WholesaleTable>
    </>
  );
}
export default Wholesalers;
