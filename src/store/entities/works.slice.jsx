import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as apiService from "../../services/api.service";
import moment from "moment";

// Actions
export const getWork = createAsyncThunk("work/fetch", async (workId) => {
  const response = await apiService.getWork(workId);
  return { data: response.data };
});

export const createWork = createAsyncThunk("work/create", async (work) => {
  const response = await apiService.createWork(work);
  return response.data;
});

export const editWork = createAsyncThunk("work/edit", async (data) => {
  const { workId, work } = data;
  const response = await apiService.editWork(workId, work);
  return response.data;
});

export const deleteWork = createAsyncThunk("work/delete", async (workId) => {
  const response = await apiService.deleteWork(workId);
  return response.data;
});

// Slice
const worksSlice = createSlice({
  name: "works",
  initialState: {
    category: null,
    entities: [],
    loading: false,
    error: null,
    lastUpdate: 0,
    currentRequestId: undefined,
  },
  reducers: {},
  extraReducers: {
    // Load
    [getWork.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [getWork.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.category = action.payload.category_id;
        state.entities = action.payload.data;
        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getWork.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createWork.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [createWork.fulfilled]: (state, action) => {
      state.category = action.payload.category_id;
      state.entities.push(action.payload.data);
      state.lastUpdate = new moment().format();
      state.loading = false;
    },
    [createWork.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Create
    [editWork.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [editWork.fulfilled]: (state, action) => {
      state.category = action.payload.category_id;
      state.entities.push(action.payload.data);
      state.lastUpdate = new moment().format();
      state.loading = false;
    },
    [editWork.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Delete
    [deleteWork.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [deleteWork.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((work) => work.id === action.meta.arg.workId);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.currentRequestId = undefined;
    },
    [deleteWork.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },
  },
});

export default worksSlice.reducer;

export const getWorkById = (workId) =>
  createSelector(
    (state) => state.work.entities,
    (work) => work.find((work) => work.id === workId)
  );
