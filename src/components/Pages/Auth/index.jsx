import React from "react";

import AuthComponent from "./auth.component";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const AfterAuth = () => {
  const auth = useSelector((state) => state.auth);
  const history = useHistory();

  useEffect(() => {
    console.log("Checking auth.", auth.isAuthenticated);
    if (auth.isAuthenticated) {
      auth.isModerator ? history.push("/mod") : history.push("/campaign");
    }
  }, [auth.isAuthenticated, auth.isModerator, history]);

  return <h1>Logging in...</h1>;
};

export default AuthComponent;
