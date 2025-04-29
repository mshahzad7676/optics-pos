import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Avatar, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  UploadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import AddFrameModal from "./Modals/addframeModal";
import FrameDetails from "../../../../../api/Frame Inventory/FrameDetailApi";
import { AppContext } from "../../../../SideNav";
import { baseImageUrl } from "../../../../../utils/constants";

function FrameTable({ searchTerm, searchCategory, searchShape }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [data, setData] = useState([]);
  const { user, store } = useContext(AppContext);

  const showEditModal = (record) => {
    setSelectedFrame(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFrame(null);
    setIsModalOpen(false);
  };

  async function fetchFrame(searchTerm, searchCategory, searchShape) {
    try {
      const frames = await FrameDetails.fetchFrame(
        searchTerm,
        searchCategory,
        searchShape,
        store.s_id
      );

      if (frames) {
        setData(frames);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch Frames:", error);
      setData([]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (store?.s_id) {
        await fetchFrame(searchTerm, searchCategory, searchShape);
      }
    };

    fetchData();
  }, [searchTerm, searchCategory, searchShape, store?.s_id]);

  const { confirm } = Modal;
  const showDeleteConfirm = (frameid) => {
    confirm({
      title: "Are you sure delete this Frame?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      maskClosable: true,
      onOk: () => handleDelete(frameid),
      onCancel() {},
    });
  };

  const handleDelete = async (frameid) => {
    const isDeleted = await FrameDetails.deleteFrame(frameid);
    if (isDeleted) {
      setData(data.filter((frame) => frame.id !== frameid));
    }
  };

  const columns = [
    {
      title: "Pic",
      dataIndex: "pic",
      render: (_, record) => (
        <Avatar
          src={`${baseImageUrl}/${record.id}-image?${performance.now()}`}
          alt="Frame Image"
        />
      ),
    },
    {
      title: "Frame ID",
      dataIndex: "id",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Shape",
      dataIndex: "shape",
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View Frame */}
          <Button color="primary" variant="filled" size="small">
            <EyeTwoTone twoToneColor="#52c41a" />
          </Button>
          {/* publish to Store */}
          <Button color="primary" variant="filled" size="small">
            <UploadOutlined twoToneColor="#52c41a" />
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

          {/* Del Frame */}
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
  //     pic: "https://via.placeholder.com/50",
  //     id: "US-S-R-01",
  //     category: "Unisex",
  //     shape: "Square",
  //     brand: "Rayban",
  //     quantity: "6",
  //     price: "1200",
  //   },
  // ];
  return (
    <>
      <Table columns={columns} dataSource={data} size="middle" />
      <AddFrameModal
        open={isModalOpen}
        onModalClose={closeModal}
        frameData={selectedFrame}
        store={store}
      />
    </>
  );
}
export default FrameTable;
