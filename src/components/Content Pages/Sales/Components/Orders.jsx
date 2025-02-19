import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import OrderTable from "./order-table";
import SalesMobile from "../../../Mobile View/Sales";
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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {isMobileView ? (
        <div
          style={{
            // display: "flex",
            // justifyContent: "space-between",
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
                width: 330,
              }}
            />
          </div>
        </div>
      ) : (
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
      )}
      {isMobileView ? (
        <SalesMobile searchTerm={searchTerm}></SalesMobile>
      ) : (
        <div className="table">
          <OrderTable searchTerm={searchTerm}></OrderTable>
        </div>
      )}
    </>
  );
}

export default Orders;
