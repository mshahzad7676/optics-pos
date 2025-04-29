import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../SideNav";
import MemberApi from "../../../api/Member/MemberApi";
import { Card, Modal, SpinLoading, Toast } from "antd-mobile";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import { Tag } from "antd";
import AddEmployee from "../../Content Pages/Employees/Modal/addEmployeeModal";

function EmployeeList({ searchTerm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [member, setMember] = useState([]);
  const { user, store } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const showEditModal = (record) => {
    setSelectedItem(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  async function fetchMember(searchTerm) {
    setLoading(true);
    try {
      const members = await MemberApi.fetchMember(searchTerm, store.s_id);
      if (members) {
        setMember(members);
      }
    } catch (error) {
      console.error("Failed to fetch Member:", error);
      Toast.show({
        content: "Error fetching Member data",
        position: "bottom",
      });
    } finally {
      setLoading(false);
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
      setMember((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      );
    }
  };

  const showDeleteConfirm = (memberId) => {
    Modal.confirm({
      header: (
        <ExclamationCircleFilled
          style={{
            fontSize: 64,
            color: "var(--adm-color-warning)",
          }}
        />
      ),
      title: "Attention",
      content: (
        <>
          <div style={{ textAlign: "center" }}>
            Are you sure you want to Delete Member: {memberId}?
          </div>
        </>
      ),
      closeOnMaskClick: true,
      confirmText: "Yes, Delete",
      confirmType: "danger",
      cancelText: "No",
      onConfirm: () => handleDelete(memberId),
      onCancel() {},
    });
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <SpinLoading color="primary" />
        </div>
      ) : member.length > 0 ? (
        member.map((mem) => (
          // <React.Fragment key={mem.id}>
          <Card
            title={
              <div style={{ fontWeight: "small" }}>Member ID: {mem.id}</div>
            }
            style={{
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
              marginBottom: 10,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 10,
                // alignItems: "center",
              }}
            >
              {/* Name */}
              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div style={{ paddingBottom: 5 }}>
                  <strong>{mem?.name || "N/A"}</strong>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: "normal",
                    color: "#999999",
                  }}
                >
                  {mem?.phone || "N/A"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Tag
                style={{
                  flexGrow: 1,

                  textAlign: "center",
                }}
                color={mem.roles === "Admin" ? "green" : "geekblue"}
              >
                {mem.roles}
              </Tag>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "right",
                margin: "10px 55px 0 55px",
                gap: "10px",
                maxWidth: "100%",
              }}
            >
              <EyeTwoTone
                twoToneColor="#52c41a"
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  minWidth: "16px",
                }}
                // onClick={() => handleViewClick(mem.id)}
              />
              <EditOutlined
                style={{
                  cursor: "pointer",
                  color: "#1890ff",
                  fontSize: "16px",
                  minWidth: "16px",
                }}
                onClick={() => showEditModal(mem)}
              />

              <AddEmployee
                open={isModalOpen}
                onModalClose={closeModal}
                itemData={selectedItem}
                store={store}
              ></AddEmployee>

              <DeleteOutlined
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontSize: "16px",
                  minWidth: "16px",
                }}
                onClick={() => showDeleteConfirm(mem.id)}
              />
            </div>
          </Card>
          // </React.Fragment>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No members Found.
        </div>
      )}
    </>
  );
}

export default EmployeeList;
