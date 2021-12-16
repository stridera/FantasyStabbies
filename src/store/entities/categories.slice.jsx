import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/campaigns.service";
import moment from "moment";

// Actions
export const getCategoriesForCampaign = createAsyncThunk("categories/fetch", async (campaignId) => {
  const response = await campaignsService.getCategories(campaignId);
  return response.data;
});

export const createCategoryForCampaign = createAsyncThunk("categories/create", async (data) => {
  const { campaignId, category, source } = data;
  const response = await campaignsService.createCategory(campaignId, category, source);
  return response.data;
});

export const deleteCategoryFromCampaign = createAsyncThunk("categories/delete", async (data) => {
  const { campaignId, categoryId } = data;
  const response = await campaignsService.deleteCategory(campaignId, categoryId);
  return response.data;
});

export const editCategoryFromCampaign = createAsyncThunk("categories/edit", async (data) => {
  const { campaignId, categoryId, category, source } = data;
  const response = await campaignsService.editCategory(campaignId, categoryId, category, source);
  return response.data;
});

// Slice
const campaignsSlice = createSlice({
  name: "categories",
  initialState: {
    campaign: null,
    entities: [],

    loading: false,
    error: null,
    lastUpdate: 0,
    currentRequestId: undefined,
  },
  reducers: {},
  extraReducers: {
    // Load
    [getCategoriesForCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [getCategoriesForCampaign.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.campaign = action.payload.campaign;
        state.entities = action.payload.categories;
        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getCategoriesForCampaign.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createCategoryForCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [createCategoryForCampaign.fulfilled]: (state, action) => {
      state.campaign = action.payload.campaign;
      state.entities.push(action.payload.category);
      state.lastUpdate = new moment().format();
      state.loading = false;
    },
    [createCategoryForCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Delete
    [deleteCategoryFromCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [deleteCategoryFromCampaign.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((category) => category.id === action.meta.arg.categoryId);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.currentRequestId = undefined;
    },
    [deleteCategoryFromCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },
  },
});

export default campaignsSlice.reducer;

export const getCategoryById = (id) =>
  createSelector(
    (state) => state.categories.entities,
    (categories) => categories.find((category) => category.id === id)
  );
