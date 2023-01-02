import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (periods = null, periodsBySport = {}) => ({
  error: null,
  loading: false,
  periods,
  periodsBySport,
});

export const getPeriods = createAsyncThunk("periods/loadPeriods", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/periods?originId=${originId}&lineId=${lineId}`);

    return {
      periods: result.data,
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

export const getPeriodsBySport = createAsyncThunk("periods/loadPeriodsBySport", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/periods/bysport?originId=${originId}&lineId=${lineId}`);

    return {
      periodsBySport: result.data,
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

const periodSlice = createSlice({
  extraReducers: {
    [getPeriods.pending]: (state) => {
      state.periods = null;
      state.error = null;
      state.loading = true;
    },
    [getPeriods.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getPeriods.fulfilled]: (state, action) => {
      state.error = null;
      state.periods = action.payload.periods;
      state.loading = false;
    },

    [getPeriodsBySport.pending]: (state) => {
      state.periodsBySport = null;
      state.error = null;
      state.loading = true;
    },
    [getPeriodsBySport.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getPeriodsBySport.fulfilled]: (state, action) => {
      state.error = null;
      state.periodsBySport = action.payload.periodsBySport;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "period",
  reducers: {},
});
const { reducer } = periodSlice;
export default reducer;
