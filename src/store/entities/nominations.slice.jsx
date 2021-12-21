import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/api.service";
import moment from "moment";

// Actions
export const getNominationsForCategory = createAsyncThunk("nominations/fetch", async (data) => {
  const { campaignId, categoryId } = data;
  const response = await campaignsService.getNominations(campaignId, categoryId);
  return { campaignId, categoryId, data: response.data };
});

export const createNominationInCategory = createAsyncThunk("nominations/create", async (data) => {
  const { work } = data;
  const response = await campaignsService.createNomination(campaignId, work);
  return response.data;
});

export const deleteNominationFromCategory = createAsyncThunk("nominations/delete", async (data) => {
  const { campaignId, nominationId } = data;
  const response = await campaignsService.deleteNomination(campaignId, nominationId);
  return response.data;
});

export const editNominationFromCampaign = createAsyncThunk("nominations/edit", async (data) => {
  const { campaignId, nominationId, work } = data;
  const response = await campaignsService.editNomination(campaignId, nominationId, work);
  return response.data;
});

// Slice
const nominationSlice = createSlice({
  name: "nominations",
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
    [getNominationsForCategory.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [getNominationsForCategory.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.category = action.payload.categoryId;
        state.entities = action.payload.data;
        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getNominationsForCategory.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createNominationInCategory.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [createNominationInCategory.fulfilled]: (state, action) => {
      state.category = action.payload.categoryId;
      state.entities.push(action.payload.data);
      state.lastUpdate = new moment().format();
      state.loading = false;
    },
    [createNominationInCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Delete
    [deleteNominationFromCategory.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [deleteNominationFromCategory.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((nomination) => nomination.id === action.meta.arg.nominationId);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.currentRequestId = undefined;
    },
    [deleteNominationFromCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },
  },
});

export default nominationSlice.reducer;

export const getNominationById = (nominationId) =>
  createSelector(
    (state) => state.nominations.entities,
    (nominations) => nominations.find((nomination) => nomination.id === nominationId)
  );
