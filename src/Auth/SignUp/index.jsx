// import React, { useState } from "react";
// import { Button, Input, Form, Typography } from "antd";
// import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
// import "../Login/login.css";
// import { Link, useNavigate } from "react-router-dom";
// const { Title } = Typography;

// function SignUp({ email, setEmail, password, setPassword, onSignUp }) {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const navigate = useNavigate();
//   const handleLogin = () => {
//     navigate(`/`);
//   };

//   const handleSignUpFinish = async () => {
//     // Trigger the sign-up process
//     const { success, data } = await onSignUp();
//     if (success) {
//       // If sign-up is successful, navigate to login page
//       navigate(`/userInfo/${data?.member?.id}`);
//       // navigate(`/userInfo/`);
//     }
//   };
//   return (
//     <div className="container">
//       <div className="screen-1">
//         {/* Form */}
//         <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
//           Sign Up
//         </Title>
//         <Form layout="vertical" onFinish={handleSignUpFinish}>
//           {/* Email */}
//           <Form.Item
//             label="Email"
//             name="email"
//             // rules={[
//             //   { required: true, message: "Please enter your email address!" },
//             //   { type: "email", message: "Enter a valid email address!" },
//             // ]}
//           >
//             <Input
//               prefix={<MailOutlined />}
//               placeholder="Username@gmail.com"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </Form.Item>

//           {/* Password */}
//           <Form.Item
//             label="Password"
//             name="password"
//             // rules={[
//             //   { required: true, message: "Please Enter Your Password!" },
//             //   { type: "password", message: "Enter a valid Password" },
//             // ]}
//           >
//             <Input
//               prefix={<LockOutlined />}
//               type={passwordVisible ? "text" : "password"}
//               placeholder="············"
//               maxLength={8}
//               suffix={
//                 <EyeOutlined
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                   style={{ cursor: "pointer" }}
//                 />
//               }
//             />
//           </Form.Item>
//           {/* Confirm Password */}
//           <Form.Item label="Confirm Password" name="confirmpassword">
//             <Input
//               prefix={<LockOutlined />}
//               type={passwordVisible ? "text" : "password"}
//               placeholder="············"
//               maxLength={8}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               suffix={
//                 <EyeOutlined
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                   style={{ cursor: "pointer" }}
//                 />
//               }
//             />
//           </Form.Item>

//           {/* Sign Up Button */}
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="login-btn"
//               block
//             >
//               Sign Up
//             </Button>
//           </Form.Item>
//         </Form>

//         {/* Footer */}
//         <div className="signup-footer">
//           <span onClick={handleLogin}>
//             <Link>Login</Link>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

import React, { useState } from "react";
import { Button, Input, Form, Typography, Modal, message } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../Login/login.css";

const { Title } = Typography;

function SignUp({
  email,
  setEmail,
  password,
  setPassword,
  onSignUp,
  onResendEmail,
  resendCooldown,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/`);
  };

  const handleSignUpFinish = async () => {
    // Trigger the sign-up process
    const { success, data } = await onSignUp();
    if (success) {
      // Show modal when email confirmation is required
      setIsModalVisible(true);

      // navigate(`/userInfo/${data?.member?.id}`);
    }
  };

  const handleResendEmail = async () => {
    const { success, error } = await onResendEmail(email);
    if (success) {
      message.success("Confirmation email resent successfully!");
    } else {
      message.error(`Error: ${error}`);
    }
  };

  return (
    <div className="container">
      <div className="screen-1">
        {/* Form */}
        <Title level={3} style={{ textAlign: "center", marginBottom: "1em" }}>
          Sign Up
        </Title>
        <Form layout="vertical" onFinish={handleSignUpFinish}>
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Username@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item label="Password" name="password">
            <Input
              prefix={<LockOutlined />}
              type={passwordVisible ? "text" : "password"}
              placeholder="············"
              maxLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                <EyeOutlined
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Form.Item>

          {/* Sign Up Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="signup-footer">
          <span onClick={handleLogin}>
            <Link>Login</Link>
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Your Email"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          // <Button key="resend" type="primary" onClick={handleResendEmail}>
          //   Resend Email
          // </Button>,

          <Button
            type="primary"
            onClick={handleResendEmail}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend Email"}
          </Button>,
        ]}
      >
        <p>Please check your email to verify your account.</p>
      </Modal>
    </div>
  );
}

export default SignUp;
