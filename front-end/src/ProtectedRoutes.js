import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isMfaVerified = localStorage.getItem("mfaVerified");

  const [isTokenValid, setTokenValid] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Define verifyToken function inside the useEffect hook
    const verifyToken = async () => {
      if (accessToken && isMfaVerified === "true") {
        try {
          const response = await axios.post(
            "https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/verify-token",
            {
              token: accessToken,
            }
          );

          if (response.data.sub) {
            setTokenValid(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("mfaVerified");
            setTokenValid(false);
          }
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("mfaVerified");
          setTokenValid(false);
        }
      } else {
        setTokenValid(false);
      }
      setVerificationComplete(true);
    };

    verifyToken(); // Call the verifyToken function
  }, [accessToken, isMfaVerified]); // Specify the dependencies here

  useEffect(() => {
    console.log("isTokenValid:", isTokenValid);
  }, [verificationComplete, isTokenValid]);

  if (!verificationComplete) {
    return <div>Loading...</div>;
  }

  return isTokenValid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
