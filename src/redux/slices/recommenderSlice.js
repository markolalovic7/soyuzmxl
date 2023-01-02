import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";

export const getInitialState = () => ({
  errorLeague: null,
  errorMatch: null,
  leagueRecommendations: undefined,
  loadingLeagueRecommendations: false,
  loadingMatchRecommendations: false,
  matchRecommendations: undefined,
});

export const loadMatchRecommendations = createAsyncThunk(
  "recommender/loadMatchRecommendations",
  async (data, thunkAPI) => {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());
    try {
      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).get(
        `/player/acc/${accountId}/matchrecommendations?originId=${originId}&lineId=${lineId}`,
      );

      return { matchRecommendations: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load match recommendations", // serializable (err.response.data)
        name: "Load Match Recommendation Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const loadLeagueRecommendations = createAsyncThunk(
  "recommender/loadLeagueRecommendations",
  async (data, thunkAPI) => {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());
    try {
      const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language }).get(
        `/player/acc/${accountId}/leaguerecommendations?originId=${originId}&lineId=${lineId}`,
      );

      return { leagueRecommendations: result.data };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to load league recommendation", // serializable (err.response.data)
        name: "Load League Recommendation Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

const recommenderSlice = createSlice({
  extraReducers: {
    [loadMatchRecommendations.pending]: (state) => {
      state.loadingMatchRecommendations = true;
      state.errorMatch = null;
    },
    [loadMatchRecommendations.rejected]: (state, action) => {
      state.loadingMatchRecommendations = false;
      state.errorMatch = action.error.message;
    },
    [loadMatchRecommendations.fulfilled]: (state, action) => {
      state.matchRecommendations = action.payload.matchRecommendations;
      state.errorMatch = null;
      state.loadingMatchRecommendations = false;
    },
    [loadLeagueRecommendations.pending]: (state) => {
      state.loadingLeagueRecommendations = true;
      state.errorLeague = null;
    },
    [loadLeagueRecommendations.rejected]: (state, action) => {
      state.loadingLeagueRecommendations = false;
      state.errorLeague = action.error.message;
    },
    [loadLeagueRecommendations.fulfilled]: (state, action) => {
      state.leagueRecommendations = action.payload.leagueRecommendations;
      state.errorLeague = null;
      state.loadingLeagueRecommendations = false;
    },
  },
  initialState: getInitialState(),
  name: "recommender",
  // reducers actions
  reducers: {
    //
  },
});
const { reducer } = recommenderSlice;
export default reducer;
