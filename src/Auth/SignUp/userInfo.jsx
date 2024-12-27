// import React, { useState } from "react";
// import { Button, Input, Form, Typography } from "antd";
// import {
//   MailOutlined,
//   LockOutlined,
//   EyeOutlined,
//   PhoneOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import "../Login/login.css";
// import { Link, useNavigate } from "react-router-dom";
// const { Title } = Typography;

// function UserInfo({
//   email,
//   setEmail,
//   password,
//   setPassword,
//   onSignUp,
//   updateMember,
// }) {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const navigate = useNavigate();
//   const [form] = Form.useForm();

//   const handleSkip = () => {
//     navigate(`/login`);
//   };

//   const handleLogin_Update = async () => {
//     form.validateFields().then((values))=

//     }
//     navigate(`/login`);

//   };
//   return (
//     <div className="container">
//       <div className="screen-1">
//         {/* Form */}
//         <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
//           User Infomation
//         </Title>
//         <Form layout="vertical" onFinish={handleSignUpFinish}>
//           {/* Email */}
//           <Form.Item label="Name" name="name">
//             <Input
//               prefix={<UserOutlined />}
//               placeholder="Ali"
//               type="text"
//               // value={name}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </Form.Item>

//           {/* Password */}
//           <Form.Item label="Phone No." name="phone">
//             <Input
//               prefix={<PhoneOutlined />}
//               placeholder="03---------"
//               maxLength={11}
//             />
//           </Form.Item>

//           {/* Next to store  */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="login-btn"
//               block
//               onClick={handleLogin_Update}
//             >
//               Next
//             </Button>
//           </Form.Item>
//           {/* skip userInfo */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="login-btn"
//               block
//               onClick={handleSkip}
//             >
//               Skip
//             </Button>
//           </Form.Item>
//         </Form>

//         {/* Footer */}
//         <div className="signup-footer">
//           {/* <span onClick={handleLogin}>
//             <Link>Login</Link>
//           </span> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserInfo;
import React, { useContext, useState } from "react";
import { Button, Input, Form, Typography } from "antd";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "../Login/login.css";
import AppContext from "antd/es/app/context";

const { Title } = Typography;

function UserInfo({ updateMember }) {
  const navigate = useNavigate();
  const { user, store } = useContext(AppContext);
  const [form] = Form.useForm();
  const { userId } = useParams();

  // Handle Skip button click
  const handleSkip = () => {
    // navigate(`/`);
    navigate(`/memberstore`);
  };

  // Handle Login and Update Member button
  const handleLogin_Update = async () => {
    try {
      const values = await form.validateFields();
      await updateMember({
        name: values.name,
        phone: values.phone,
        id: userId,
      });

      // navigate(`/`);
      navigate(`/memberstore`);
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

          {/* Next to store */}
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
