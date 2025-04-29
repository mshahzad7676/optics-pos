import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Input, Row, Select } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import TransactionTable from "./components/transaction-table";
import TransactionApi from "../../../api/TransactionApi";
import { AppContext } from "../../SideNav";
import CustomerAPI from "../../../api/CustomerApi";
import MakeTransaction from "./Modal";
import BillingList from "../../Mobile View/Billing";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function OrderTransactions() {
  const [Data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, store } = useContext(AppContext);
  const [selectedCustomer, setSelectedCustomer] = useState("");
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

  const handleCustomerSelect = (value) => {
    // console.log("selected customer:", value);
    setSelectedCustomer(value);
    setSearchTerm("");
  };

  async function fetchData(searchTerm) {
    try {
      const result = await CustomerAPI.fetchCustomers(searchTerm, store.s_id);
      if (result) {
        const { data } = result;
        setData(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }

  useEffect(() => {
    if (store?.s_id) {
      fetchData(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

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
            <h2>Order Transactions</h2>

            <Button
              onClick={showModal}
              type="primary"
              shape="round"
              icon={<PlusCircleOutlined />}
            >
              Transaction
            </Button>
            <MakeTransaction
              open={isModalOpen}
              Data={Data}
              store={store}
              onModalClose={() => setIsModalOpen(false)}
            ></MakeTransaction>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Input
                onChange={handleSearchChange}
                placeholder="Name,Phone No"
                enterButton
                value={searchTerm}
                allowClear
                suffix={suffix}
                style={{
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </Col>

            <Col span={12}>
              <Select
                allowClear
                showSearch
                placeholder="Select Customer Name"
                optionFilterProp="label"
                style={{ width: "100%" }}
                // onChange={(value) => {
                //   console.log("selected customer:", value);
                //   setSelectedCustomer(value);
                // }}
                onChange={handleCustomerSelect}
                options={Data?.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                }))}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 20 }}>
            <BillingList
              searchTerm={searchTerm}
              selectedCustomer={selectedCustomer}
            ></BillingList>
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
            <h2>Order Transactions</h2>

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
                allowClear
                value={searchTerm}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select Customer Name"
              optionFilterProp="label"
              style={{ marginBottom: "10px", width: 300 }}
              // onChange={(value) => {
              //   console.log("selected customer:", value);
              //   setSelectedCustomer(value);
              // }}
              onChange={handleCustomerSelect}
              options={Data?.map((customer) => ({
                value: customer.id,
                label: customer.name,
              }))}
            />
            <Button
              onClick={showModal}
              type="primary"
              shape="round-large"
              icon={<PlusCircleOutlined />}
            >
              Transaction
            </Button>
            <MakeTransaction
              open={isModalOpen}
              Data={Data}
              store={store}
              onModalClose={() => setIsModalOpen(false)}
            ></MakeTransaction>
          </div>
          <div className="table">
            <TransactionTable
              searchTerm={searchTerm}
              selectedCustomer={selectedCustomer}
            ></TransactionTable>
          </div>
        </>
      )}
    </>
  );
}

export default OrderTransactions;
