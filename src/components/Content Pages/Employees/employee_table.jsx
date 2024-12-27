import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { AppContext } from "../../SideNav";
import AddEmployee from "./Modal/addEmployeeModal";
import MemberApi from "../../../api/Member/MemberApi";

function EmployeeTable({ searchTerm }) {
  const navigate = useNavigate();

  const handleAddVisitClick = (id) => {
    navigate(`/customer/${id}/order/`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [member, setMember] = useState([]);
  const { user, store } = useContext(AppContext);

  const showEditModal = (record) => {
    setSelectedItem(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };
  async function fetchMember(searchTerm) {
    try {
      const members = await MemberApi.fetchMember(searchTerm, store.s_id);
      // console.log(employees, "employees");
      if (members) {
        setMember(members);
      }
    } catch (error) {
      console.error("Failed to fetch Member:", error);
    }
  }
  useEffect(() => {
    if (store?.s_id) {
      fetchMember(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

  const handleDelete = async (memberId) => {
    const isDeleted = await MemberApi.deleteMember(memberId);
    if (isDeleted) {
      setMember(member.filter((member) => member.id !== memberId));
    }
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (memberId) => {
    confirm({
      title: "Are you sure delete this Member?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(memberId),
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone No",
      dataIndex: "phone",
    },
    {
      title: "Roles",
      key: "roles",
      dataIndex: "roles",
      render: (_, { roles }) => {
        const roleList = Array.isArray(roles) ? roles : roles ? [roles] : [];
        return (
          <>
            {roleList.map((role) => {
              // let color = role.length >= 5 ? "green" : "geekblue";
              let color = role;
              if (role === "Admin") {
                color = "green";
              } else color = "geekblue";
              return (
                <Tag color={color} key={role}>
                  {role.toUpperCase()}
                </Tag>
              );
            })}
          </>
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            color="primary"
            variant="filled"
            size="small"
            // onClick={() => handleViewClick(record.id)}
          >
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>
          <Button
            color="primary"
            size="small"
            variant="filled"
            onClick={() => showEditModal(record)}
          >
            <EditOutlined />
          </Button>

          <Button
            color="danger"
            variant="filled"
            size="small"
            onClick={() => showDeleteConfirm(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={member} size="middle" />
      <AddEmployee
        open={isModalOpen}
        onModalClose={closeModal}
        itemData={selectedItem}
        store={store}
      ></AddEmployee>
    </>
  );
}

export default EmployeeTable;
