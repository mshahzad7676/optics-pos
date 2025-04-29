import MainPage, { AppContext } from "./components/SideNav";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import React, { useState, useEffect } from "react";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import ResetPassword from "./Auth/Reset";
import SetNewPassword from "./Auth/SetPassword";
import AuthServieApi from "./api/AuthApi";
import UserInfo from "./Auth/SignUp/userInfo";
import MemberStores from "./components/Content Pages/Employees/Member Stores";
import StoreInfo from "./Auth/SignUp/storeInfo";
import { message } from "antd";
import { useContext } from "react";
import UserApi from "./api/UserApi";
import MemberApi from "./api/Member/MemberApi";

// Protected route wrapper
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState([]);
  const [stores, setStores] = useState([]);
  const [user, setUser] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    // const storeDescription = "Default store description";
    const { data, error } = await AuthServieApi.signUp(
      email,
      password
      // storeDescription
    );

    if (error) {
      // console.log("Error during sign-up:", error.message);
      message.error("This Email is already registered. Please Log in instead.");
      return { data, success: false };
    } else {
      console.log("Sign-up successful! User and store created:", data);
      return { data, success: true };
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) {
      alert(`Please wait ${resendCooldown} seconds before resending.`);
      return;
    }

    const { data, error } = await AuthServieApi.resendConfirmationEmail(email);

    if (error) {
      console.log("Error resending confirmation email:", error.message);

      if (error.code === "over_email_send_rate_limit") {
        setResendCooldown(60);
      }

      return { data, success: false };
    } else {
      console.log("Confirmation email resent successfully:", data);

      setResendCooldown(60);

      return { data, success: true };
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleUpdateMember = async (updatedMember) => {
    try {
      // Ensure API call returns a response before destructuring
      const response = await AuthServieApi.updateMember(updatedMember);

      if (!response) {
        throw new Error("No response from API");
      }

      const { data, error } = response;

      if (error) {
        console.error("Error updating member:", error.message);
        return { data: null, success: false };
      }

      console.log("Update successful! Member updated:", data);

      // Ensure members exist before updating
      setMembers(
        (prevMembers) =>
          prevMembers?.map((member) =>
            member.id === updatedMember.id
              ? { ...member, ...data.member }
              : member
          ) || []
      );

      return { data, success: true };
    } catch (err) {
      console.error("Unexpected error in handleUpdateMember:", err);
      return { data: null, success: false };
    }
  };

  // const handleUpdateStore = async (updatedStore) => {
  //   await AuthServieApi.updateStore(updatedStore);
  //   const updatedStores = stores.map((store) =>
  //     store.id === updatedStore.id ? updatedStore : store
  //   );
  //   setStores(updatedStores);
  // };

  const handleUpdateStore = async (updatedStore) => {
    try {
      // Ensure API call returns a response before destructuring
      const response = await AuthServieApi.updateStore(updatedStore);

      if (!response) {
        throw new Error("No response from API");
      }

      const { data, error } = response;

      if (error) {
        console.error("Error updating store:", error.message);
        return { data: null, success: false };
      }

      console.log("Update successful! Store updated:", data);

      // Ensure stores exist before updating
      setStores(
        (prevStores) =>
          prevStores?.map((store) =>
            store.id === updatedStore.id ? { ...store, ...data.store } : store
          ) || []
      );

      return { data, success: true };
    } catch (err) {
      console.error("Unexpected error in handleUpdateStore:", err);
      return { data: null, success: false };
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await AuthServieApi.signIn(email, password);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        message.error(
          "Your email is not confirmed. Please verify it before logging in."
        );
      } else {
        message.error(`Error: ${error.message}`);
      }
    } else {
      message.success("Logged in successfully!");
      setIsAuthenticated(true);
      navigate("/memberstores");
    }
  };

  const handleSignOut = async () => {
    const error = await AuthServieApi.signOut();
    if (error) {
      console.log(error.message);
    } else {
      console.log("Logged out successfully!");
      setIsAuthenticated(false);
      // localStorage.removeItem("isAuthenticated");

      navigate("/login");
    }
  };

  const fetchUserAndMemberInfo = async () => {
    try {
      const authUser = await UserApi.fetchUser();

      if (authUser) {
        setUser(authUser);

        // Fetch member info only after authUser is available
        const storeMember = await MemberApi.fetchallMembers(authUser.id);

        if (storeMember) {
          setMemberData(storeMember.memberRecord?.[0]);
        }
      } else {
        console.error("No user found.");
      }
    } catch (error) {
      console.error(
        "Unexpected error in fetchUserAndMemberInfo:",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchUserAndMemberInfo();
  }, []);

  return (
    // <Router>

    <Routes>
      <Route
        path="/login"
        element={
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLogin={handleSignIn}
          />
        }
      />

      {/* <Route
        path="/memberstores"
        element={<MemberStores></MemberStores>}
      ></Route> */}

      <Route
        path="/signup"
        element={
          <SignUp
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSignUp={handleSignUp}
            onResendEmail={handleResendEmail}
            resendCooldown={resendCooldown}
          />
        }
      />
      <Route
        // path="/userInfo/:userId"
        path="/userInfo/"
        element={
          <UserInfo
            userId={user.id}
            memberId={memberData?.id}
            updateMember={handleUpdateMember}
          ></UserInfo>
        }
      ></Route>
      <Route
        path="/storeInfo/:userId"
        element={<StoreInfo updateStore={handleUpdateStore}></StoreInfo>}
      ></Route>

      <Route path="/forgetpassword" element={<ResetPassword />} />
      <Route path="/SetNewPassword" element={<SetNewPassword />} />
      <Route
        path="/*"
        element={
          // <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MainPage
            password={password}
            setPassword={setPassword}
            onLogout={handleSignOut}
          />
          // </ProtectedRoute>
        }
      />
    </Routes>

    // </Router>
  );
}

export default App;
