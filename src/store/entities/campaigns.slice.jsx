import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/campaigns.service";
import moment from "moment";

export const getCampaigns = createAsyncThunk("campaigns/fetch", async () => {
  const response = await campaignsService.getCampaigns();
  return response.data;
});

export const createCampaign = createAsyncThunk("campaign/create", async (data, { rejectWithValue }) => {
  try {
    const response = await campaignsService.createCampaign(data);
    return response.data;
  } catch (err) {
    if (!err.response) throw err;
    return rejectWithValue(err.response.data);
  }
});

export const deleteCampaign = createAsyncThunk("campaign/delete", async (campaignId) => {
  const response = await campaignsService.deleteCampagin(campaignId);
  return response.data;
});

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    entities: [],
    loaded: false,
    loading: false,
    error: null,
    currentRequestId: undefined,
    lastUpdate: 0,
  },
  reducers: {},
  extraReducers: {
    // Get
    [getCampaigns.pending]: (state, action) => {
      state.loading = true;
      state.loadError = null;
      state.currentRequestId = action.meta.requestId;
    },
    [getCampaigns.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.entities = action.payload.campaigns;
        state.loaded = true;
        state.loading = false;
        state.currentRequestId = undefined;
        state.error = null;
        state.lastUpdate = new moment().format();
      }
    },
    [getCampaigns.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Create
    [createCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [createCampaign.fulfilled]: (state, action) => {
      state.entities.push(action.payload.campaign);
      state.loading = false;
      state.error = null;
    },
    [createCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload ? action.payload.error : action.error;
      console.dir(action);
    },

    // Delete
    [deleteCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [deleteCampaign.fulfilled]: (state, action) => {
      console.dir(action);
      const index = state.entities.findIndex((campaign) => campaign._id === action.meta.arg);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.error = null;
    },
    [deleteCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload ? action.payload.error : action.error;
      console.dir(action);
    },
  },
});

export default campaignsSlice.reducer;

export const allCampaigns = createSelector((state) => state.campaigns.entities);
export const activeCampaigns = createSelector(
  (state) => state.campaigns.entities,
  (campaigns) => campaigns.filter((campaign) => moment().isBetween(campaign.startDate, campaign.endDate))
);
export const getCampaignBySlug = (slug) =>
  createSelector(
    (state) => state.campaigns.entities,
    (campaigns) => campaigns.find((campaign) => campaign.slug === slug)
  );
