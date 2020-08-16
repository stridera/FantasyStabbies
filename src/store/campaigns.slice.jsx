import { createSlice, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../services/campaigns.service";
import moment from "moment";

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    entities: [],
    loadError: null,
    modifyError: null,
    loading: false,
  },
  reducers: {
    // Create
    newCampaignRequested: (campaigns, action) => {
      campaigns.loading = true;
      campaigns.modifyError = null;
    },
    campaignCreated: (campaigns, action) => {
      campaigns.entities.push(action.payload);
      campaigns.loading = false;
      campaigns.modifyError = null;
    },
    campaignCreationFailed: (campaigns, action) => {
      campaigns.loading = false;
      campaigns.modifyError = action.payload;
    },
    // Get
    campaignsRequested: (campaigns, action) => {
      campaigns.loading = true;
      campaigns.loadError = null;
    },
    campaignsRequestFailed: (campaigns, action) => {
      campaigns.loading = false;
      campaigns.loadError = action.payload;
    },
    campaginsReceived: (campaigns, action) => {
      campaigns.loading = false;
      campaigns.loadError = null;
      campaigns.entities = action.payload;
    },
  },
});

const {
  newCampaignRequested,
  campaignCreated,
  campaignCreationFailed,
  campaignsRequested,
  campaignsRequestFailed,
  campaginsReceived,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;

export const createCampaign = (
  campaignName,
  isPublic,
  nominationStartDate,
  votingStartDate,
  endDate,
  ageRequirement
) => async (dispatch) => {
  try {
    dispatch({ type: newCampaignRequested.type });
    const res = await campaignsService.createCampaign(
      campaignName,
      isPublic,
      nominationStartDate,
      votingStartDate,
      endDate,
      ageRequirement
    );

    dispatch({ type: campaignCreated.type, payload: res.data });
  } catch (err) {
    const error = err.response?.data?.message || err.message;
    dispatch({
      type: campaignCreationFailed.type,
      payload: error,
    });
  }
};

export const getCampaigns = () => async (dispatch) => {
  try {
    dispatch({ type: campaignsRequested.type });
    const res = await campaignsService.getCampaigns();

    dispatch({ type: campaginsReceived.type, payload: res.data });
  } catch (err) {
    const error = err.response?.data?.message || err.message;
    dispatch({
      type: campaignsRequestFailed.type,
      payload: error,
    });
  }
};

export const allCampaigns = createSelector((state) => state.campaigns.entities);
export const activeCampaigns = createSelector(
  (state) => state.campaigns.entities,
  (campaigns) => campaigns.filter((campaign) => moment().isBetween(campaign.startDate, campaign.endDate))
);
