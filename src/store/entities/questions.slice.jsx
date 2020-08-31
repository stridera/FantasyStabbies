import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import * as campaignsService from "../../services/campaigns.service";
import moment from "moment";

// Actions
export const getQuestionsForCampaign = createAsyncThunk("questions/fetch", async (campaignId) => {
  const response = await campaignsService.getQuestions(campaignId);
  return response.data;
});

export const createQuestionForCampaign = createAsyncThunk("questions/create", async (data) => {
  const { campaignId, question, source } = data;
  const response = await campaignsService.createQuestion(campaignId, question, source);
  return response.data;
});

export const deleteQuestionFromCampaign = createAsyncThunk("questions/delete", async (data) => {
  const { campaignId, questionId } = data;
  const response = await campaignsService.deleteQuestion(campaignId, questionId);
  return response.data;
});

export const editQuestionFromCampaign = createAsyncThunk("questions/edit", async (data) => {
  const { campaignId, questionId, question, source } = data;
  const response = await campaignsService.editQuestion(campaignId, questionId, question, source);
  return response.data;
});

// Slice
const campaignsSlice = createSlice({
  name: "questions",
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
    [getQuestionsForCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [getQuestionsForCampaign.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.campaign = action.payload.campaign;
        state.entities = action.payload.questions;
        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getQuestionsForCampaign.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createQuestionForCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [createQuestionForCampaign.fulfilled]: (state, action) => {
      state.campaign = action.payload.campaign;
      state.entities.push(action.payload.question);
      state.lastUpdate = new moment().format();
      state.loading = false;
    },
    [createQuestionForCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Delete
    [deleteQuestionFromCampaign.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    },
    [deleteQuestionFromCampaign.fulfilled]: (state, action) => {
      const index = state.entities.findIndex((question) => question._id === action.meta.arg.questionId);
      if (index !== -1) state.entities.splice(index, 1);
      state.loading = false;
      state.currentRequestId = undefined;
    },
    [deleteQuestionFromCampaign.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },
  },
});

export default campaignsSlice.reducer;

export const getQuestionById = (id) =>
  createSelector(
    (state) => state.questions.entities,
    (questions) => questions.find((question) => question._id === id)
  );
