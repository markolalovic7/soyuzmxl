import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (jackpots = []) => ({
  error: null,
  jackpots,
  loading: false,
});

export const getJackpots = createAsyncThunk("jackpots/loadJackpots", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/jackpotbet/list?originId=${originId}&lineId=${lineId}`);

    return {
      jackpots: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain country details", // serializable (err.response.data)
      name: "Country list Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const jackpotSlice = createSlice({
  extraReducers: {
    [getJackpots.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getJackpots.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getJackpots.fulfilled]: (state, action) => {
      state.jackpots = action.payload.jackpots;
      state.loading = false;
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "jackpots",
  reducers: {},
});
const { reducer } = jackpotSlice;
export default reducer;
