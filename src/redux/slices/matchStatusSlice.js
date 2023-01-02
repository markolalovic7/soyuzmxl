import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (matchStatuses = null) => ({
  error: null,
  loading: false,
  matchStatuses,
});

export const getMatchStatuses = createAsyncThunk("matchStatus/loadMatchStatuses", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/matchstatus?originId=${originId}&lineId=${lineId}`);

    return {
      matchStatuses: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain period details", // serializable (err.response.data)
      name: "Periods List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const matchStatusSlice = createSlice({
  extraReducers: {
    [getMatchStatuses.pending]: (state) => {
      state.matchStatuses = null;
      state.error = null;
      state.loading = true;
    },
    [getMatchStatuses.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getMatchStatuses.fulfilled]: (state, action) => {
      state.error = null;
      state.matchStatuses = action.payload.matchStatuses;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "matchStatus",
  reducers: {},
});
const { reducer } = matchStatusSlice;
export default reducer;
