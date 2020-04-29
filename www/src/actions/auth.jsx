import axios from "axios";

import { USER_LOADED, AUTH_ERROR, LOGOUT } from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/user");

    console.log(res);
    dispatch({
      type: USER_LOADED,
      data: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
