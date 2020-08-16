import { createSlice } from "@reduxjs/toolkit";
import * as authService from "../services/auth.service";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isAuthenticated: null,
    username: null,
    userID: null,
    redditID: null,
    isModerator: null,
    created: null,
    loading: false,
    error: null,
  },

  reducers: {
    authRequested: (auth, action) => {
      auth.loading = true;
      auth.error = null;
    },
    authReceived: (auth, action) => {
      auth.isAuthenticated = true;
      auth.userID = action.payload._id;
      auth.username = action.payload.username;
      auth.isModerator = action.payload.moderator || false;
      auth.redditID = action.payload.redditId;
      auth.created = action.payload.created;
      auth.loading = false;
    },
    authFailed: (auth, action) => {
      auth.loading = false;
      auth.isModerator = false;
      auth.isAuthenticated = false;
      auth.error = action.payload;
    },
    loggedOut: (auth, action) => {
      console.log("Auth is now undefined.");
      auth = undefined;
    },
  },
});

const { authRequested, authReceived, authFailed, loggedOut } = authSlice.actions;

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: authRequested.type });
    const res = await authService.login();

    dispatch({
      type: authReceived.type,
      payload: res.data,
    });
  } catch (err) {
    const data = err.response.data;
    dispatch({
      type: authFailed.type,
      payload: data.error ? data.error.message : data.message,
    });
  }
};

// Logout / Clear Profile
export const logout = () => async (dispatch) => {
  dispatch({ type: loggedOut.type });
};

export default authSlice.reducer;
