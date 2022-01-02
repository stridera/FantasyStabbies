import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/api.service";
import moment from "moment";

// Actions
export const getCategoriesForCampaign = createAsyncThunk("categories/fetch", async (campaign_id) => {
  const response = await campaignsService.getCategories(campaign_id);
  return response.data;
});

export const createCategoryForCampaign = createAsyncThunk("categories/create", async (data) => {
  const { campaign_id, title, description, source } = data;
  const response = await campaignsService.createCategory(campaign_id, title, description, source);
  return response.data;
});

export const deleteCategoryFromCampaign = createAsyncThunk("categories/delete", async (data) => {
  const { campaign_id, category_id } = data;
  const response = await campaignsService.deleteCategory(campaign_id, category_id);
  return response.data;
});

export const editCategoryFromCampaign = createAsyncThunk("categories/edit", async (data) => {
  const { campaign_id, category_id, title, description, source } = data;
  const response = await campaignsService.editCategory(campaign_id, category_id, title, description, source);
  return response.data;
});

// Slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    campaign_id: null,
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
      state.currentRequestId = action.meta.request_id;
    },
    [getCategoriesForCampaign.fulfilled]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        state.campaign_id = action.payload.campaign_id;
        state.entities = action.payload.categories;
        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getCategoriesForCampaign.rejected]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createCategoryForCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.request_id;
    },
    [createCategoryForCampaign.fulfilled]: (state, action) => {
      state.campaign_id = action.payload.campaign_id;
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
      state.currentRequestId = action.meta.request_id;
    },
    [deleteCategoryFromCampaign.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((category) => category.id === action.meta.arg.category_id);
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

export default categoriesSlice.reducer;

export const getCategoryById = (category_id) =>
  createSelector(
    (state) => state.categories.entities,
    (categories) => categories.find((category) => category.id === category_id)
  );
