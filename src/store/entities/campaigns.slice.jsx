import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/api.service";
import moment from "moment";
import { get } from "lodash";

export const statusStates = {
  waiting: "waiting",
  nominating: "nominating",
  voting: "voting",
  ended: "ended",
};

export const getCampaigns = createAsyncThunk("campaigns/fetch", async () => {
  const { data } = await campaignsService.getCampaigns();
  return data;
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

export const deleteCampaign = createAsyncThunk("campaign/delete", async (campagin_id) => {
  const response = await campaignsService.deleteCampagin(campagin_id);
  return response.data;
});

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    entities: [],
    loading: false,
    loadingComplete: false,
    error: null,
    currentRequestId: undefined,
    lastUpdate: 0,
  },
  reducers: {
    default: (state, action) => {
      state.error = action.payload;
    },
  },
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
        state.entities = action.payload;
        state.loadingComplete = true;
        state.loading = false;
        state.currentRequestId = undefined;
        state.error = null;
        state.lastUpdate = new moment().format();
      }
    },
    [getCampaigns.rejected]: (state, action) => {
      state.loading = false;
      state.loadingComplete = true;
      state.error = action.error;
      state.currentRequestId = undefined;
      state.lastUpdate = new moment().format();
    },

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
      state.error = action.payload ? action.payload.error : action.error;
    },

    // Delete
    [deleteCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [deleteCampaign.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((campaign) => campaign.id === action.meta.arg);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.error = null;
    },
    [deleteCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload ? action.payload.error : action.error;
    },
  },
});

export default campaignsSlice.reducer;

export const allCampaigns = createSelector((state) => state.campaigns.entities);
export const activeCampaigns = createSelector(
  (state) => state.campaigns.entities,
  (campaigns) =>
    campaigns.filter((campaign) => moment().isBetween(campaign.nominate_start_date, campaign.voting_end_date))
);
export const getCampaignBySlug = (slug) =>
  createSelector(
    (state) => state.campaigns.entities,
    (campaigns) => campaigns.find((campaign) => campaign.slug === slug)
  );
export const getCampaignStatus = (campaign) => {
  const now = new moment();
  var diff;

  diff = moment(campaign.nominate_start_date).diff(now);
  if (diff > 0) {
    return {
      status: statusStates.waiting,
      message: `Nominations starts in ${moment.duration(diff).humanize()}.`,
    };
  }

  const nom_diff = moment(campaign.nominate_end_date).diff(now);
  const vote_diff = moment(campaign.voting_start_date).diff(now);

  if (nom_diff > 0) {
    return {
      status: statusStates.nominating,
      message: `Taking nominations for ${moment.duration(nom_diff).humanize()}.  Voting starts in ${moment
        .duration(vote_diff)
        .humanize()}.`,
    };
  }

  if (vote_diff > 0) {
    return {
      status: statusStates.waiting,
      message: `Nominations starts in ${moment.duration(vote_diff).humanize()}.`,
    };
  }

  diff = moment(campaign.voting_end_date).diff(now);
  if (diff > 0) {
    return {
      status: statusStates.voting,
      message: `Accepting Votes.  Voting Ends in ${moment.duration(diff).humanize()}.`,
    };
  }

  return { status: statusStates.ended, message: `Voting ended ${moment.duration(diff).humanize()} ago.` };
};
