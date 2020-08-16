import React from "react";

import AuthComponent from "./auth.component";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "../../../store/auth.slice";
import { useHistory } from "react-router";

export const AfterAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      auth.isModerator ? history.push("/mod") : history.push("/vote");
    }
  }, [auth, history]);

  return <h1>Logging in...</h1>;
};

export default AuthComponent;
