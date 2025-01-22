import React, { useContext, useState } from "react";
import { Button, Select, Row, Input, Col } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import FrameTable from "./frameTable";
import AddFrameModal from "./Modals/addframeModal";
import { AppContext } from "../../../../SideNav";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function FramesInventory(params) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, store } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchShape, setSearchShape] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const handleShapeChange = (e) => {
    setSearchShape(e.target.value);
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
        <h2>Frames Inventory</h2>

        <Button
          type="primary"
          shape="round-large"
          icon={<PlusCircleOutlined />}
          onClick={showModal}
        >
          Add Frame Inventory
        </Button>
      </div>
      {/* Add Frame Modal */}
      <AddFrameModal
        open={isModalOpen}
        onModalClose={() => setIsModalOpen(false)}
        store={store}
      ></AddFrameModal>
      <Row gutter={16}>
        <Col>
          <Input
            onChange={handleSearchChange}
            placeholder="Frame Id"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 200,
            }}
          />
        </Col>
        <Col>
          <Input
            onChange={handleCategoryChange}
            placeholder="Search Frame Category"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 200,
            }}
          />
        </Col>
        <Col>
          <Input
            onChange={handleShapeChange}
            placeholder="Search Frame Shape"
            suffix={suffix}
            style={{
              fontSize: "14px",
              width: 200,
            }}
          />
        </Col>
        {/* <Col>
          <Button type="primary" shape="round-large" icon={<SearchOutlined />}>
            Filter
          </Button>
        </Col> */}
      </Row>
      <br></br>
      <FrameTable
        searchTerm={searchTerm}
        searchCategory={searchCategory}
        searchShape={searchShape}
      ></FrameTable>
    </>
  );
}

export default FramesInventory;
