import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../SideNav";
import FrameDetails from "../../../../api/Frame Inventory/FrameDetailApi";
import { Col, Row } from "antd";
import { Card, Divider, Image, Modal, SpinLoading, Toast } from "antd-mobile";
import { baseImageUrl } from "../../../../utils/constants";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import AddFrameModal from "../../../Content Pages/Inventory/components/Frames Inventory/Modals/addframeModal";

function FramesList({ searchTerm, searchCategory, searchShape }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [data, setData] = useState([]);
  const { user, store } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const showEditModal = (record) => {
    setSelectedFrame(record);
    console.log(`${record}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFrame(null);
    setIsModalOpen(false);
  };

  async function fetchFrame(searchTerm, searchCategory, searchShape) {
    setLoading(true);

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
      Toast.show({
        content: "Error fetching customer data",
        position: "bottom",
      });
      setData([]);
    } finally {
      setLoading(false);
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

  const handleDelete = async (frameid) => {
    const isDeleted = await FrameDetails.deleteFrame(frameid);
    if (isDeleted) {
      setData(data.filter((frame) => frame.id !== frameid));
    }
  };
  const showDeleteConfirm = (frameid) => {
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
            Are you sure you want to Delete Frame: {frameid}?
          </div>
        </>
      ),
      closeOnMaskClick: true,
      confirmText: "Yes, Delete",
      cancelText: "No",
      locale: null,
      onConfirm: () => handleDelete(frameid),
      onCancel: () => {},
    });
  };
  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <SpinLoading color="primary" />
        </div>
      ) : data.length > 0 ? (
        <>
          {data.map((frame) => (
            <>
              <Card
                title={
                  <div style={{ fontWeight: "small" }}>
                    Frame ID: {frame.id}
                  </div>
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
                <Row gutter={16} align="middle">
                  {/* Image Column */}
                  <Col
                    span={8}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "0.5px solid rgb(149, 144, 144)",
                    }}
                  >
                    <Image
                      src={`${baseImageUrl}/${
                        frame.id
                      }-image?${performance.now()}`}
                      width={80}
                      height={80}
                      fit="cover"
                      style={{ borderRadius: "52px" }}
                    />
                  </Col>

                  {/* Text Column */}
                  <Col span={16}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div>
                        <strong>Category:</strong> {frame.category || "N/A"}
                      </div>
                      <div>
                        <strong>Shape:</strong> {frame.shape || "N/A"}
                      </div>
                      <div>
                        <strong>Brand:</strong> {frame.brand || "N/A"}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {frame.quantity || "N/A"}
                      </div>
                      <div>
                        <strong>Price:</strong>
                        {frame.price ? `${frame.price}` : "N/A"}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider></Divider>
                {/* Actions */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "right",
                    margin: "10px 70px 0 70px",
                    gap: "10px",
                    maxWidth: "100%",
                  }}
                >
                  <UploadOutlined
                    style={{
                      cursor: "pointer",
                      color: "#52c41a",
                      fontSize: "18px",
                    }}
                  ></UploadOutlined>
                  <EditOutlined
                    style={{
                      cursor: "pointer",
                      color: "#1890ff",
                      fontSize: "18px",
                    }}
                    onClick={() => showEditModal(frame)}
                  />
                  <DeleteOutlined
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "18px",
                    }}
                    onClick={() => showDeleteConfirm(frame.id)}
                  />
                </div>
              </Card>
            </>
          ))}
          <AddFrameModal
            open={isModalOpen}
            onModalClose={closeModal}
            frameData={selectedFrame}
            store={store}
          />
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No Frame Found.</p>
      )}
    </>
  );
}

export default FramesList;
