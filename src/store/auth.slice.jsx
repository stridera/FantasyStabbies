import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../services/auth.service";

export const login = createAsyncThunk("auth/login", async (unused, { rejectWithValue }) => {
  const response = await authService.login();
  return response.data;
});

export const logout = createAsyncThunk("auth/logOut", async () => {
  const response = await authService.logout();
  return response.data;
});

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
    loaded: false,
  },
  reducers: {},
  extraReducers: {
    [login.pending]: (auth, action) => {
      auth.loading = true;
      auth.loaded = false;
    },
    [login.fulfilled]: (auth, action) => {
      auth.isAuthenticated = true;
      auth.userID = action.payload._id;
      auth.username = action.payload.username;
      auth.isModerator = action.payload.moderator || false;
      auth.redditID = action.payload.redditId;
      auth.created = action.payload.created;
      auth.loading = false;
      auth.loaded = true;
    },
    [login.rejected]: (auth, action) => {
      auth.loading = false;
      auth.isModerator = false;
      auth.isAuthenticated = false;
      auth.error = action.error;
      auth.loaded = true;
    },

    [logout.fulfilled]: (auth, action) => {
      auth.isAuthenticated = null;
      auth.username = null;
      auth.userID = null;
      auth.redditID = null;
      auth.isModerator = null;
      auth.created = null;
      auth.loading = false;
      auth.loaded = true;
    },
  },
});

export default authSlice.reducer;
