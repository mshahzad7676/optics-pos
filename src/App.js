import MainPage from "./components/SideNav";
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

// Protected route wrapper
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check for the authentication state in localStorage on component load
  //   const storedAuthState = localStorage.getItem("isAuthenticated");
  //   if (storedAuthState === "true") {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleGetUser = async () => {
  //     const user = await AuthServieApi.getCurrentUser();
  //     if (user) {
  //       setIsAuthenticated(true);
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };
  //   handleGetUser();
  // }, []);

  // const handleSignUp = async () => {
  //   const { error } = await AuthServieApi.signUp(email, password);
  //   if (error) {
  //     console.log(error.message);
  //     return false;
  //   } else {
  //     console.log("Sign-up successful!");
  //     return true;
  //   }
  // };

  const handleSignUp = async () => {
    // const storeDescription = "Default store description";
    const { data, error } = await AuthServieApi.signUp(
      email,
      password
      // storeDescription
    );

    if (error) {
      console.log("Error during sign-up:", error.message);
      return false;
    } else {
      console.log("Sign-up successful! User and store created:", data);
      return true;
    }
  };

  const handleSignIn = async () => {
    const { error } = await AuthServieApi.signIn(email, password);
    if (error) {
      console.log(error.message);
    } else {
      console.log("Logged in successfully!");
      setIsAuthenticated(true);

      // const user = await AuthServieApi.getCurrentUser();
      // if (user && user.id) {
      // navigate(`/user/${user.id}`);
      // }
      navigate("/");
      // localStorage.setItem("isAuthenticated", "true");
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

      <Route
        path="/signup"
        element={
          <SignUp
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSignUp={handleSignUp}
          />
        }
      />

      <Route path="/forgetpassword" element={<ResetPassword />} />
      <Route path="/SetNewPassword" element={<SetNewPassword />} />
      <Route
        path="/*"
        element={
          // <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MainPage onLogout={handleSignOut} />
          // </ProtectedRoute>
        }
      />
    </Routes>
    // </Router>
  );
}

export default App;
