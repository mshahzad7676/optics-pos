import React, { useState } from "react";
import { Button, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import TranscationTable from "./transcation-table";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function OrderTranscations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        <h2>Order Transcations</h2>

        <div
          style={{
            gap: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            onChange={handleSearchChange}
            placeholder="Name,Phone No"
            enterButton
            suffix={suffix}
            style={{
              fontSize: "16px",
              width: 300,
            }}
          />
          {/* <Button
            onClick={showModal}
            type="primary"
            shape="round-large"
            icon={<PlusCircleOutlined />}
          >
            Add Record
          </Button>
          <AddCustomer
            open={isModalOpen}
            onModalClose={() => setIsModalOpen(false)}
            setFormData={setFormData}
          ></AddCustomer> */}
        </div>
      </div>
      <div className="table">
        <TranscationTable searchTerm={searchTerm}></TranscationTable>
      </div>
    </>
  );
}

export default OrderTranscations;
