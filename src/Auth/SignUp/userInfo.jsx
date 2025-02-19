// import React, { useContext, useState } from "react";
// import { Button, Input, Form, Typography } from "antd";
// import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
// import { useNavigate, useParams } from "react-router-dom";
// import "../Login/login.css";

// const { Title } = Typography;

// function UserInfo({ updateMember }) {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const { userId } = useParams();

//   // Handle Skip button click
//   const handleSkip = () => {
//     navigate(`/storeinfo/${userId}`);
//     // navigate(`/memberstore`);
//   };

//   // Handle Login and Update Member button
//   const handleLogin_Update = async () => {
//     try {
//       const values = await form.validateFields();
//       const { response, data } = await updateMember({
//         name: values.name,
//         phone: values.phone,
//         id: userId,
//       });
//       if (response) {
//         // navigate(`/storeInfo`);
//         // navigate(`/memberstores`);
//         navigate(`/storeInfo/${response?.member?.u_id}`);
//       }
//     } catch (error) {
//       console.error("Error updating member:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="screen-1">
//         {/* Form */}
//         <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
//           User Information
//         </Title>
//         <Form layout="vertical" form={form}>
//           {/* Name */}
//           <Form.Item
//             label="Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter your name!" }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="Ali" type="text" />
//           </Form.Item>

//           {/* Phone */}
//           <Form.Item
//             label="Phone No."
//             name="phone"
//             rules={[
//               { required: true, message: "Please enter your phone number!" },
//               { len: 11, message: "Phone number must be 11 digits!" },
//             ]}
//           >
//             <Input
//               prefix={<PhoneOutlined />}
//               placeholder="03---------"
//               maxLength={11}
//             />
//           </Form.Item>

//           {/* Next to storeInfo */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="button"
//               className="login-btn"
//               block
//               onClick={handleLogin_Update}
//             >
//               Next
//             </Button>
//           </Form.Item>

//           {/* Skip userInfo */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="button"
//               className="login-btn"
//               block
//               onClick={handleSkip}
//             >
//               Skip
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default UserInfo;
import React, { useState } from "react";
import { Button, Input, Form, Typography } from "antd";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "../Login/login.css";

const { Title } = Typography;

function UserInfo({ updateMember }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { userId } = useParams();

  // Handle Skip button click
  const handleSkip = () => {
    navigate(`/storeinfo/${userId}`);
  };

  // Handle Login and Update Member button
  // const handleLogin_Update = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     // Ensure updateMember returns an object
  //     const result = await updateMember({
  //       name: values.name,
  //       phone: values.phone,
  //       id: userId,
  //     });

  //     console.log("updateMember result:", result);

  //     if (!result || typeof result !== "object") {
  //       throw new Error("updateMember did not return a valid object");
  //     }

  //     const { response, data } = result; // Safe destructuring after validation

  //     if (response && data?.member?.u_id) {
  //       navigate(`/storeInfo/${data.member.u_id}`);
  //     } else {
  //       console.error("Invalid API response:", response, data);
  //     }
  //   } catch (error) {
  //     console.error("Error updating member:", error);
  //   }
  // };

  const handleLogin_Update = async () => {
    try {
      const values = await form.validateFields();
      const { success, data } = await updateMember({
        name: values.name,
        phone: values.phone,
        id: userId,
      });
      console.log(data, "res");
      if (success) {
        // navigate(`/storeInfo`);
        // navigate(`/memberstores`);
        navigate(`/storeInfo/${data?.[0]?.u_id}`);
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          User Information
        </Title>
        <Form layout="vertical" form={form}>
          {/* Name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ali" type="text" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label="Phone No."
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { len: 11, message: "Phone number must be 11 digits!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="03---------"
              maxLength={11}
            />
          </Form.Item>

          {/* Next to storeInfo */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              className="login-btn"
              block
              onClick={handleLogin_Update}
            >
              Next
            </Button>
          </Form.Item>

          {/* Skip userInfo */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              className="login-btn"
              block
              onClick={handleSkip}
            >
              Skip
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default UserInfo;
