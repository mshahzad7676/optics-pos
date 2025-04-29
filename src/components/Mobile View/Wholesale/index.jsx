import { Tag } from "antd";
import { Card, SpinLoading } from "antd-mobile";
import React from "react";
import { PlusSquareTwoTone } from "@ant-design/icons";

function WholesaleList({ data, loading }) {
  return (
    <>
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
          }}
        >
          <SpinLoading color="primary" />
        </div>
      ) : data.length > 0 ? (
        <>
          {data.map((shop) => (
            <Card
              title={
                <div style={{ fontWeight: "small" }}>Shop ID: {shop.s_id}</div>
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
              {/* Store Info */}
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
                  <div style={{ fontSize: 18, paddingBottom: 5 }}>
                    <strong>{shop?.name || "N/A"}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: "normal",
                      color: "#999999",
                    }}
                  >
                    {shop?.city || "N/A"}
                  </div>
                </div>
              </div>

              {/* actions */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "right",
                  margin: "10px 50px 0 50px",
                  gap: "10px",
                  maxWidth: "100%",
                }}
              >
                {/* Store type */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flex: 1,
                    minWidth: "120px",
                  }}
                >
                  <Tag
                    color={
                      shop.type === "Retail"
                        ? "green"
                        : shop.type === "Wholesale"
                        ? "blue"
                        : "red"
                    }
                    style={{
                      height: 33,
                      textAlign: "center",
                      paddingTop: 5,
                      width: "100%",
                      minWidth: "80px",
                      flexGrow: 1,
                    }}
                  >
                    {shop.type || "N/A"}
                  </Tag>
                </div>

                {/* Plus Icon */}
                <PlusSquareTwoTone
                  twoToneColor="#52c41a"
                  style={{
                    cursor: "pointer",
                    fontSize: "32px",
                    minWidth: "32px",
                    flexShrink: 0,
                  }}
                />
              </div>
            </Card>
          ))}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No Shop Found.</p>
      )}
    </>
  );
}
export default WholesaleList;
