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

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const { success, data } = await AdditemDetail.fetchAllDetail(store.s_id);
      setItemData(data);
    } catch (error) {
      console.error("Error fetching item details:", error);
      setItemData([]);
    }
  }

  //fetch filter data with type and num
  async function fetchFilteredData() {
    const filters = {
      glassType: normalizeValue(searchType),
      sph: normalizeValue(searchSph),
      cyl: normalizeValue(searchCyl),
      addition: normalizeValue(searchAdd),
    };
    // console.log(filters);

    try {
      const { data } = await AdditemDetail.fetchFilteredDetails(
        filters,
        store.s_id
      );

      if (data.length === 0) {
        message.error("No data Found with the selected filters.");
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

  const useResponsiveColumns = (isMobileView, searchSph, searchCyl) => {
    let columns = isMobileView
      ? [
          { title: "Typ.", dataIndex: "glass_type" },
          { title: "Sph", dataIndex: "sph" },
          // { title: "Cyl", dataIndex: "cyl" },
          // { title: "Add", dataIndex: "addition" },
          { title: "Qty.", dataIndex: "held_quantity" },
          { title: "Rs.", dataIndex: "price" },
          {
            title: "Act.",
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
        ]
      : [
          { title: "Type", dataIndex: "glass_type" },
          { title: "Sph.", dataIndex: "sph" },
          // { title: "Add.", dataIndex: "addition" },
          { title: "Qty.", dataIndex: "held_quantity" },
          { title: "Price", dataIndex: "price" },
          {
            title: "Action",
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

    // Conditionally add "Cyl." column
    if (!searchSph || searchCyl) {
      columns.splice(2, 0, { title: "Cyl.", dataIndex: "cyl" });
    }

    // Conditionally add "Add." column
    if (!searchSph || searchAdd) {
      columns.splice(3, 0, { title: "Add", dataIndex: "addition" });
    }

    return columns;
  };
  // Usage Example
  const columns = useResponsiveColumns(
    isMobileView,
    searchSph,
    searchCyl,
    searchAdd
  );

  return (
    <>
      {isMobileView ? (
        <>
          <h2>Inventory Filter</h2>
          <Col span={12}>
            <Select
              allowClear
              showSearch
              placeholder="Select Glass Type"
              optionFilterProp="label"
              style={{ marginBottom: "10px", width: 180 }}
              value={searchType || undefined}
              onChange={handleSearchTypeChange}
              options={items?.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
            />
          </Col>
          <Row gutter={12}>
            <Col span={7} style={{ width: "auto" }}>
              <Form.Item>
                <SphNumberSelector
                  value={searchSph}
                  onChange={handleSearchSphChange}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ width: "auto" }}>
              <Form.Item>
                <CylNumberSelector
                  value={searchCyl}
                  onChange={handleSearchCylChange}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ width: "auto" }}>
              <Form.Item>
                <AddtitionNumList
                  value={searchAdd}
                  onChange={handleSearchAddChange}
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Button
                type="primary"
                color="danger"
                variant="solid"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <h2>Inventory Filter</h2>
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
        </>
      )}

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
