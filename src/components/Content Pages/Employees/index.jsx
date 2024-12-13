import React, { useState } from "react";
import { Button, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

import AddEmployee from "./Modal/addEmployeeModal";
import EmployeeTable from "./employee_table";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function Employee() {
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
        <h2>Employee Records</h2>

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
          <Button
            onClick={showModal}
            type="primary"
            shape="round-large"
            icon={<PlusCircleOutlined />}
          >
            Add Empolyee
          </Button>
          <AddEmployee
            open={isModalOpen}
            onModalClose={() => setIsModalOpen(false)}
            setFormData={setFormData}
          ></AddEmployee>
        </div>
      </div>
      <div className="table">
        <EmployeeTable searchTerm={searchTerm}></EmployeeTable>
      </div>
    </>
  );
}

export default Employee;
