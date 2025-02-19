// import React, { useState } from "react";
// import { Button, Input } from "antd";
// import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
// import CustomerTable from "./customer-table";
// import AddCustomer from "./Modals/Personal-Info/addmodal";
// import CustomerMobile from "../../Mobile View/Customers";

// const suffix = (
//   <SearchOutlined
//     style={{
//       fontSize: 16,
//       color: "#1677ff",
//     }}
//   />
// );

// function Customers() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "10px",
//         }}
//       >
//         <h2>Customers Records</h2>

//         <div
//           style={{
//             gap: "10px",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Input
//             onChange={handleSearchChange}
//             placeholder="Name,Phone No"
//             enterButton
//             suffix={suffix}
//             style={{
//               fontSize: "16px",
//               width: 300,
//             }}
//           />
//           <Button
//             onClick={showModal}
//             type="primary"
//             shape="round-large"
//             icon={<PlusCircleOutlined />}
//           >
//             Add Customer
//           </Button>
//           <AddCustomer
//             open={isModalOpen}
//             onModalClose={() => setIsModalOpen(false)}
//             setFormData={setFormData}
//           ></AddCustomer>
//         </div>
//       </div>
//       <CustomerMobile></CustomerMobile>
//       <div className="table">
//         <CustomerTable searchTerm={searchTerm}></CustomerTable>
//       </div>
//     </>
//   );
// }

// export default Customers;

import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import CustomerTable from "./customer-table";
import AddCustomer from "./Modals/Personal-Info/addmodal";
import CustomerMobile from "../../Mobile View/Customers";

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {/* Mobile View */}
      {isMobileView ? (
        <div
          style={{
            // display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <h2>Customers Records</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "16px",
            }}
          >
            <Input
              onChange={handleSearchChange}
              placeholder="Name, Phone No"
              allowClear
              suffix={suffix}
              style={{
                fontSize: "16px",
                flex: 1,
                minWidth: "150px",
              }}
            />
            <Button
              onClick={showModal}
              type="primary"
              shape="round"
              icon={<PlusCircleOutlined />}
              style={{ flexShrink: 0 }}
            >
              Customer
            </Button>
            <AddCustomer
              open={isModalOpen}
              onModalClose={() => setIsModalOpen(false)}
              setFormData={setFormData}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2>Customers Records</h2>

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
              icon={<PlusCircleOutlined />}
            >
              Add Customer
            </Button>
            <AddCustomer
              open={isModalOpen}
              onModalClose={() => setIsModalOpen(false)}
              setFormData={setFormData}
            />
          </div>
        </div>
      )}
      {/* Conditionally render CustomerMobile or CustomerTable */}
      {isMobileView ? (
        <CustomerMobile searchTerm={searchTerm} />
      ) : (
        <CustomerTable searchTerm={searchTerm} />
      )}
    </>
  );
}

export default Customers;
