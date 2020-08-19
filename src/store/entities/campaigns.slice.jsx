import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/campaigns.service";
import moment from "moment";

export const getCampaigns = createAsyncThunk("campaigns/fetch", async () => {
  const response = await campaignsService.getCampaigns();
  return response.data;
});

export const createCampaign = createAsyncThunk("campaigns/create", async (data) => {
  const response = await campaignsService.createCampaign(data);
  return response.data;
});

// export const createCampaign = (data) => async (dispatch) => {
//   try {
//     dispatch({ type: newCampaignRequested.type });
//     const res = await campaignsService.createCampaign(data);

//     if (res.data.success) {
//       const campaign = res.data.campaign;
//       dispatch({ type: campaignCreated.type, payload: campaign });
//     } else {
//       dispatch({
//         type: campaignCreationFailed.type,
//         payload: res.error,
//       });
//     }
//   } catch (err) {
//     const data = err.response?.data;
//     let error = "An error has occured.";
//     switch (data?.name) {
//       case "MongoError":
//         error =
//           data.code === 11000
//             ? "Slug already in use.  Please change and try again."
//             : "Database error.  Please try again.";
//         break;
//       case "ValidationError":
//         error = `Validation Error: ${data.message}`;
//         break;
//       default:
//         error = err.response?.data?.message || err.message;
//     }

//     dispatch({
//       type: campaignCreationFailed.type,
//       payload: error,
//     });
//   }
// };

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
    // Create
    [createCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [createCampaign.fulfilled]: (state, action) => {
      state.entities.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    [createCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

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
