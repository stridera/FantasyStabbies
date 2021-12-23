import React from "react";

import AuthComponent from "./auth.component";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const AfterAuth = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking auth.", auth.isAuthenticated);
    if (auth.isAuthenticated) {
      auth.isModerator ? navigate("/mod") : navigate("/campaign");
    }
  }, [auth.isAuthenticated, auth.isModerator, navigate]);

  return <h1>Logging in...</h1>;
};

export default AuthComponent;
