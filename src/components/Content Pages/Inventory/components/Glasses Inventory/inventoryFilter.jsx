import React, { useContext, useState, useEffect } from "react";
import { Button, Select, Row, Col, Table, message, Form } from "antd";
import { EditOutlined } from "@ant-design/icons";
import SphNumberSelector from "../../../Customers/components/sphnumlist";
import CylNumberSelector from "../../../Customers/components/Cylnumlist";
import AddtitionNumList from "../../../Customers/components/Additionnumlist";
import GlassTypeApi from "../../../../../api/Glasses Inventory/GlassTypeApi";
import { AppContext } from "../../../../SideNav";
import AdditemDetail from "../../../../../api/Glasses Inventory/AdditemDetail";
import InventoryEditModal from "./Modal/inventoryEditModal";

function InventoryFilter() {
  const [searchType, setSearchType] = useState("");
  const [searchSph, setSearchSph] = useState("");
  const [searchCyl, setSearchCyl] = useState("");
  const [searchAdd, setSearchAdd] = useState("");
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { store } = useContext(AppContext);

  // Normalize values
  const normalizeValue = (value) => {
    if (typeof value === "string") {
      return value
        .replace("+", "")
        .replace(/\.0+$/, "")
        .replace(/^(-?\d+)\.00$/, "$1");
    }
    return value;
  };

  // Fetch glass types from the backend
  async function fetchGlassType() {
    try {
      const items = await GlassTypeApi.fetchGlassType("", store.s_id);
      if (items) {
        setItems(items);
      }
    } catch (error) {
      console.error("Failed to fetch Glass Types:", error);
    }
  }

  // Fetch all item details
  async function fetchData() {
    try {
      const { success, data } = await AdditemDetail.fetchAllDetails();
      setItemData(data);
    } catch (error) {
      console.error("Error fetching item details:", error);
      setItemData([]);
    }
  }

  async function fetchFilteredData() {
    const filters = {
      glassType: normalizeValue(searchType),
      sph: normalizeValue(searchSph),
      cyl: normalizeValue(searchCyl),
      addition: normalizeValue(searchAdd),
    };

    try {
      const { data } = await AdditemDetail.fetchFilteredDetails(filters);

      if (data.length === 0) {
        message.error("No data found with the selected filters.");
      }

      setItemData(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setItemData([]);
    }
  }

  // Fetch glass types and item details on store change
  useEffect(() => {
    if (store?.s_id) {
      fetchGlassType();
      fetchData();
    }
  }, [store?.s_id]);

  useEffect(() => {
    fetchFilteredData();
  }, [searchType, searchSph, searchCyl, searchAdd]);

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
  };

  const handleSearchSphChange = (value) => {
    setSearchSph(normalizeValue(value));
  };

  const handleSearchCylChange = (value) => {
    setSearchCyl(normalizeValue(value));
  };

  const handleSearchAddChange = (value) => {
    setSearchAdd(normalizeValue(value));
  };

  const handleResetFilters = () => {
    setSearchType("");
    setSearchSph("");
    setSearchCyl("");
    setSearchAdd("");
    fetchData();
  };
  const handleViewClick = (record) => {
    setSelectedItem(record);
    setisEditModalOpen(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setisEditModalOpen(false);
  };
  // Table columns \
  const columns = [
    { title: "Name", dataIndex: "glass_type" },
    { title: "Sph.", dataIndex: "sph" },
    { title: "Cyl.", dataIndex: "cyl" },
    { title: "Add.", dataIndex: "addition" },
    { title: "Quantity.", dataIndex: "held_quantity" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          color="primary"
          size="small"
          variant="filled"
          onClick={() => handleViewClick(record)}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2>Inventory</h2>
      <Row gutter={12}>
        <Col>
          <Select
            allowClear
            showSearch
            placeholder="Select Glass Type"
            optionFilterProp="label"
            style={{ marginBottom: "10px", width: 160 }}
            value={searchType || undefined}
            onChange={handleSearchTypeChange}
            options={items?.map((item) => ({
              value: item.name,
              label: item.name,
            }))}
          />
        </Col>

        <Col span={3} style={{ width: "auto" }}>
          <Form.Item>
            <SphNumberSelector
              value={searchSph}
              onChange={handleSearchSphChange}
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ width: "auto" }}>
          <Form.Item>
            <CylNumberSelector
              value={searchCyl}
              onChange={handleSearchCylChange}
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ width: "auto" }}>
          <Form.Item>
            <AddtitionNumList
              value={searchAdd}
              onChange={handleSearchAddChange}
            />
          </Form.Item>
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

      <Table
        columns={columns}
        dataSource={itemData}
        rowKey="id"
        scroll={{ y: 400 }}
        pagination={false}
        size="middle"
      />
      <InventoryEditModal
        open={isEditModalOpen}
        onModalClose={closeModal}
        itemData={selectedItem}
        store={store}
      />
    </>
  );
}

export default InventoryFilter;
