import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  ExclamationCircleFilled,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../../SideNav";
import AddGlassTypeModal from "./Modal/addGlassTypeModal";
import GlassTypeApi from "../../../../../api/Glasses Inventory/GlassTypeApi";

function GlassTypeTable({ searchTerm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [item, setItem] = useState([]);
  const { user, store } = useContext(AppContext);
  const navigate = useNavigate();

  const showEditModal = (record) => {
    setSelectedItem(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  async function fetchGlassType(searchTerm) {
    try {
      const items = await GlassTypeApi.fetchGlassType(searchTerm, store.s_id);
      // console.log(item, "sum wala");

      if (items) {
        setItem(items);
      }
    } catch (error) {
      console.error("Failed to fetch Items:", error);
    }
  }
  useEffect(() => {
    if (store?.s_id) {
      fetchGlassType(searchTerm);
    }
  }, [searchTerm, store?.s_id]);

  const { confirm } = Modal;
  const showDeleteConfirm = (item_id) => {
    confirm({
      title: "Are you sure delete this Item?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(item_id),
      onCancel() {},
    });
  };

  const handleDelete = async (item_id) => {
    const isDeleted = await GlassTypeApi.deleteGlassType(item_id);
    if (isDeleted) {
      setItem(item.filter((item) => item.id !== item_id));
    }
  };
  const handleAddItemDetails = (id, glass_type) => {
    navigate(`/addItemsDetails/${id}/${glass_type}`);
  };
  const handleViewItemDetails = (id) => {
    navigate(`/viewItemsDetails/${id}`);
  };

  const columns = [
    {
      title: "Item ID",
      dataIndex: "id",
    },
    {
      title: "Item",
      dataIndex: "name",
    },

    {
      title: "Total Quantity",
      dataIndex: "quantity",
    },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View Item */}
          <Button
            onClick={() => handleViewItemDetails(record.id)}
            color="primary"
            variant="filled"
            size="small"
          >
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>

          {/* Add Item Details */}
          <Button
            onClick={() => handleAddItemDetails(record.id, record.name)}
            color="primary"
            size="small"
            variant="filled"
          >
            <PlusSquareTwoTone twoToneColor="#52c41a" />
          </Button>
          {/* Edit */}
          <Button
            onClick={() => showEditModal(record)}
            color="primary"
            size="small"
            variant="filled"
          >
            <EditOutlined />
          </Button>

          {/* Del Item */}
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
  // const data = [
  //   {
  //     id: "1",
  //     name: "Blue cut",
  //     quantity: "6",
  //     // price: "220",
  //   },
  // ];
  return (
    <>
      <Table columns={columns} dataSource={item} size="middle" />
      <AddGlassTypeModal
        open={isModalOpen}
        onModalClose={closeModal}
        itemData={selectedItem}
        store={store}
      />
    </>
  );
}
export default GlassTypeTable;
