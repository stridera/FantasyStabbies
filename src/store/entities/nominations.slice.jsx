import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {
  getNominations,
  createNomination,
  deleteNomination,
  editNomination,
  addVote,
  removeVote,
} from "../../services/api.service";
import moment from "moment";

// Actions
export const getNominationsForCategory = createAsyncThunk("nominations/fetch", async (category) => {
  const response = await getNominations(category.campaign_id, category.id);
  return { campagin_id: category.campaign, category_id: category.id, data: response.data };
});

export const createNominationInCategory = createAsyncThunk("nominations/create", async (data) => {
  const { category, work } = data;
  const response = await createNomination(category.campaign_id, category.id, work.id);
  return response.data;
});

export const deleteNominationFromCategory = createAsyncThunk("nominations/delete", async (data) => {
  const { category, nominationId } = data;
  const response = await deleteNomination(category.campaign_id, category.id, nominationId);
  return response.data;
});

export const editNominationFromCampaign = createAsyncThunk("nominations/edit", async (data) => {
  const { category, nominationId, work } = data;
  const response = await editNomination(category.campaign_id, category.id, nominationId, work.id);
  return response.data;
});

export const voteForNomination = createAsyncThunk("nominations/vote", async (data) => {
  const { category, nomination } = data;
  const response = await addVote(category.campaign_id, category.id, nomination.id);
  return response.data;
});

export const removeVoteForNomination = createAsyncThunk("nominations/unvote", async (data) => {
  const { category, nomination } = data;
  const response = await removeVote(category.campaign_id, category.id, nomination.id);
  return response.data;
});

// Slice
const nominationsSlice = createSlice({
  name: "nominations",
  initialState: {
    campagin_id: null,
    category_id: null,
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
      state.currentRequestId = action.meta.request_id;
    },
    [getNominationsForCategory.fulfilled]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        state.campagin_id = action.payload.campagin_id;
        state.category_id = action.payload.category_id;
        state.entities = action.payload.data.map((entity) => {
          entity.voted = entity.voted === "1" ? true : false;
          return entity;
        });

        state.lastUpdate = new moment().format();
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [getNominationsForCategory.rejected]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },

    // Create
    [createNominationInCategory.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.request_id;
    },
    [createNominationInCategory.fulfilled]: (state, action) => {
      const { payload } = action;
      state.campagin_id = payload.campagin_id;
      state.category_id = payload.category_id;
      state.entities.push(payload.data);
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
      state.currentRequestId = action.meta.request_id;
    },
    [deleteNominationFromCategory.fulfilled]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        const index = state.entities.findIndex((nomination) => nomination.id === action.meta.arg.nomination.id);
        if (index !== -1) state.entities.splice(index, 1);
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [deleteNominationFromCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Vote
    [voteForNomination.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.request_id;
    },
    [voteForNomination.fulfilled]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        const index = state.entities.findIndex((nomination) => nomination.id === action.meta.arg.nomination.id);
        state.entities[index].voted = true;
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [voteForNomination.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },

    // Remove Vote
    [removeVoteForNomination.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.request_id;
    },
    [removeVoteForNomination.fulfilled]: (state, action) => {
      const { request_id } = action.meta;
      if (state.loading && state.currentRequestId === request_id) {
        const index = state.entities.findIndex((nomination) => nomination.id === action.meta.arg.nomination.id);
        console.log(state.entities, index);
        state.entities[index].voted = false;
        state.loading = false;
        state.currentRequestId = undefined;
      }
    },
    [removeVoteForNomination.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.currentRequestId = undefined;
    },
  },
});

export default nominationsSlice.reducer;

export const getNominationById = (nominationId) =>
  createSelector(
    (state) => state.nominations.entities,
    (nominations) => nominations.find((nomination) => nomination.id === nominationId)
  );

export const getNominationsWithWorks = () =>
  createSelector(
    (state) => state.nominations.entities,
    (nominations) =>
      nominations.map((nomination) => ({
        ...nomination,
        work: nomination.work_id ? nomination.work : null,
      }))
  );
