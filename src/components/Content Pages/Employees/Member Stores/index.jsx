import React, { useContext, useEffect } from "react";
import { Card, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../SideNav";

function MemberStores() {
  const { member, storesList } = useContext(AppContext);
  const navigate = useNavigate();

  const stores = [];
  if (member) {
    stores.push({
      name: member?.e_store?.name || "Unknown Store",
      role: member?.roles || "Unknown Role",
      s_id: member?.s_id,
      u_id: member?.e_store?.u_id,
    });
  }

  useEffect(() => {
    if (storesList.length === 1) {
      navigate(`/store/${storesList[0].s_id}`);
    }
  }, [storesList, navigate]);

  const handleClick = (s_id) => {
    navigate(`/store/${s_id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        title="Stores List"
        bordered={false}
        style={{
          width: 400,
        }}
      >
        {storesList.length > 0 ? (
          storesList.map((store, index) => (
            <Row
              key={index}
              onClick={() => handleClick(store.s_id)}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                marginBottom: "5px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e6f7ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <div>
                <strong>{store.name}</strong> ({store.role})
              </div>
            </Row>
          ))
        ) : (
          <div>No stores available</div>
        )}
      </Card>
    </div>
  );
}

export default MemberStores;
