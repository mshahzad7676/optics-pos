import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import OrderTable from "./order-table";
// import { useNavigate } from "react-router-dom";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function Orders() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        <h2>Orders Records</h2>
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
              color: "#1677ff",
              width: 300,
            }}
          />
        </div>
      </div>
      <div className="table">
        <OrderTable searchTerm={searchTerm}></OrderTable>
      </div>
    </>
  );
}

export default Orders;
