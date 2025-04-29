import React, { useContext, useEffect, useState } from "react";
import { Button, Select, Row, Input, Col } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../../../SideNav";
import GlassTypeTable from "./GlasstypeTable";
import AddItemModal from "./Modal/addGlassTypeModal";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function GlassesInventory(params) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, store } = useContext(AppContext);
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {isMobileView ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2>Glasses Types</h2>

            <Button
              type="primary"
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={showModal}
            >
              Glass Type
            </Button>
            <AddItemModal
              open={isModalOpen}
              onModalClose={() => setIsModalOpen(false)}
              store={store}
            ></AddItemModal>
          </div>
          <div
            style={{
              gap: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              onChange={handleSearchChange}
              placeholder="Item Id, Name"
              suffix={suffix}
              style={{
                fontSize: "14px",
                width: 250,
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2>Glasses Types</h2>
            <div
              style={{
                gap: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                onChange={handleSearchChange}
                placeholder="Item Id, Name"
                suffix={suffix}
                style={{
                  fontSize: "14px",
                  width: 250,
                }}
              />

              <Button
                type="primary"
                shape="round-large"
                icon={<PlusCircleOutlined />}
                onClick={showModal}
              >
                Glass Type
              </Button>
              <AddItemModal
                open={isModalOpen}
                onModalClose={() => setIsModalOpen(false)}
                store={store}
              ></AddItemModal>
            </div>
          </div>
        </>
      )}
      <br></br>
      <GlassTypeTable store={store} searchTerm={searchTerm}></GlassTypeTable>
    </>
  );
}

export default GlassesInventory;
