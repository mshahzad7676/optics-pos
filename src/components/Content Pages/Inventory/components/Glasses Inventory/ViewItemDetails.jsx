import React, { useState, useEffect } from "react";
import { Select, Col, Row, Table, Button, Modal } from "antd";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

import AdditemDetail from "../../../../../api/Glasses Inventory/AdditemDetail";
import { glassMinusRange } from "../../../../../utils/constants";
import "./modalPrint.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const today = new Date().toISOString().split("T")[0];

function ViewItemDetails({ store }) {
  const [rangeData, setRangeData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [selectedRangeFilter, setSelectedRangeFlter] = useState(undefined);
  const [shortItems, setShortItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { glass_type_id, glass_type } = useParams();

  useEffect(() => {
    const ranges = {};
    glassMinusRange.forEach((range) => {
      ranges[range.value] = [];
    });
    setRangeData(ranges);
  }, []);

  // Fetch all data by filters
  useEffect(() => {
    async function fetchData() {
      try {
        const filter =
          selectedRangeFilter === "All" || !selectedRangeFilter
            ? undefined
            : selectedRangeFilter;
        const { success, data } = await AdditemDetail.fetchAllDetails(
          glass_type_id,
          filter,
          store.s_id
        );
        setItemData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemData([]);
      }
    }
    fetchData();
  }, [glass_type_id, selectedRangeFilter]);

  const handleRangeChange = (value) => {
    setSelectedRangeFlter(value);
  };

  // const showShortage = () => {
  //   const filteredItems = itemData.filter((item) => item.held_quantity < 5);
  //   setShortItems(filteredItems);
  //   setIsModalVisible(true);
  // };
  const showShortage = () => {
    // Filter items with quantity < 5
    const filteredItems = itemData.filter((item) => item.held_quantity < 5);
    setShortItems(filteredItems);

    if (filteredItems.length === 0) {
      Modal.info({
        title: "No Shortage",
        content: "All items have sufficient stock.",
      });
      return;
    }

    const downloadPDF = () => {
      const content = document.getElementById("shortage-modal-content");
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        // pdf.save("Item_Shortage_Report.pdf"); // Save file
        pdf.save(`${glass_type}_${selectedRangeFilter}.pdf`); // Save file
      });
    };

    Modal.confirm({
      // title: "Shortage Items",
      width: 500,
      icon: null,
      maskClosable: true,
      content: (
        <div id="shortage-modal-content">
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <strong>Item: </strong>
              {glass_type}
            </span>
            <span>
              <strong>Range: </strong>
              {selectedRangeFilter || "All"}
            </span>
            <span>
              <strong>Date: </strong>
              {today}
            </span>
          </Row>
          <Table
            dataSource={filteredItems}
            columns={[
              { title: "Sph", dataIndex: "sph" },
              { title: "Cyl", dataIndex: "cyl" },
              { title: "Addition", dataIndex: "addition" },
              { title: "Quantity", dataIndex: "held_quantity" },
            ]}
            pagination={false}
            rowKey="id"
            size="small"
          />
        </div>
      ),
      footer: (
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          {/* <Button type="default" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button> */}
          <Button type="primary" onClick={() => window.print()}>
            Print
          </Button>
          <Button type="default" onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      ),
    });
  };

  const handleOrderConfirm = () => {
    console.log("Creating order for:", shortItems);
    // TODO: Add API call to create an order
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Sph", dataIndex: "sph" },
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
      sorter: (a, b) => a.held_quantity - b.held_quantity,
    },
    { title: "Price", dataIndex: "price" },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 5 }}>
        <Col>
          <Select
            showSearch
            allowClear
            defaultValue="All"
            placeholder="Select Range"
            optionFilterProp="label"
            options={glassMinusRange}
            onChange={handleRangeChange}
            style={{ fontSize: "14px", width: 210 }}
          />
        </Col>
      </Row>

      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ marginTop: 25 }}>
          {selectedRangeFilter
            ? `${glass_type}/${selectedRangeFilter}`
            : `All ${glass_type}`}
        </h2>
        <Button
          // type="primary"
          color="danger"
          variant="solid"
          shape="round-large"
          icon={<EditOutlined />}
          onClick={showShortage}
        >
          Shortage
        </Button>
      </Row>

      <Table
        columns={columns}
        pagination={false}
        scroll={{ y: 400 }}
        rowKey="id"
        dataSource={itemData}
        showSorterTooltip={{ target: "sorter-icon" }}
      />

      {/* Shortage Modal */}
      {/* <Modal
        title="Shortage Items"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOrderConfirm}
        okText="Make Order"
        cancelText="Cancel"
      >
        {shortItems.length > 0 ? (
          <Table
            columns={[
              { title: "Sph", dataIndex: "sph" },
              { title: "Cyl", dataIndex: "cyl" },
              { title: "Addition", dataIndex: "addition" },
              { title: "Quantity", dataIndex: "held_quantity" },
            ]}
            dataSource={shortItems}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <p>No items with low stock.</p>
        )}
      </Modal> */}
    </>
  );
}

export default ViewItemDetails;
