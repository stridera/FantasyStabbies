import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isModerator: null,
    loading: true,
    user: null,
    error: null,
  },
  reducers: {
    authRequested: (auth, action) => {
      auth.loading = true;
      auth.error = null;
    },
    authReceived: (auth, action) => {
      auth.isAuthenticated = true;
      auth.isModerator = action.payload.moderator || false;
      auth.user = action.payload;
      auth.loading = false;
    },
    authFailed: (auth, action) => {
      auth.loading = false;
      auth.isModerator = false;
      auth.isAuthenticated = false;
      auth.error = action.payload;
    },
    loggedOut: (auth, action) => {
      auth.isAuthenticated = false;
      auth.isModerator = false;
      auth.user = undefined;
      auth.error = null;
      auth.loading = false;
    },
  },
});

const { authRequested, authReceived, authFailed, loggedOut } = authSlice.actions;

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: authRequested.type });
    const res = await axios.get("/api/user");

    dispatch({
      type: authReceived.type,
      payload: res.data,
    });
  } catch (err) {
    console.log("error", err.error);
    const data = err.response.data;
    dispatch({
      type: authFailed.type,
      payload: data.error ? data.error.message : data.message,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: loggedOut.type });
};

export default authSlice.reducer;
