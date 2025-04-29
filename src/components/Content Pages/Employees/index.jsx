import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import AddEmployee from "./Modal/addEmployeeModal";
import EmployeeTable from "./employee_table";
import InviteModal from "./Modal/inviteModal";
import EmployeeList from "../../Mobile View/Employees";

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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
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

  const showInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {isMobileView ? (
        <>
          <h2>Employee Records</h2>

          <div
            style={{
              gap: "10px",
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
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
              shape="round"
              icon={<UserAddOutlined />}
            >
              Member
            </Button>
            <AddEmployee
              open={isModalOpen}
              onModalClose={() => setIsModalOpen(false)}
              setFormData={setFormData}
            ></AddEmployee>
            {/* <Button
              onClick={showInviteModal}
              type="primary"
              shape="round-large"
              icon={<UserAddOutlined />}
            >
              Invite Member
            </Button>
            <InviteModal
              open={isInviteModalOpen}
              onModalClose={() => setIsInviteModalOpen(false)}
            ></InviteModal> */}
          </div>

          <EmployeeList searchTerm={searchTerm}></EmployeeList>
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
                icon={<UserAddOutlined />}
              >
                Add Member
              </Button>
              <AddEmployee
                open={isModalOpen}
                onModalClose={() => setIsModalOpen(false)}
                setFormData={setFormData}
              ></AddEmployee>
              <Button
                onClick={showInviteModal}
                type="primary"
                shape="round-large"
                icon={<UserAddOutlined />}
              >
                Invite Member
              </Button>
              <InviteModal
                open={isInviteModalOpen}
                onModalClose={() => setIsInviteModalOpen(false)}
              ></InviteModal>
            </div>
          </div>
          <div className="table">
            <EmployeeTable searchTerm={searchTerm}></EmployeeTable>
          </div>
        </>
      )}
    </>
  );
}

export default Employee;
