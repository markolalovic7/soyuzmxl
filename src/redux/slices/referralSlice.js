import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (referrals = null) => ({
  error: null,
  loading: false,
  referrals,
});

export const getReferrals = createAsyncThunk("referral/loadReferral", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/referralmethods?originId=${originId}&lineId=${lineId}`);

    return {
      referrals: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain referral details", // serializable (err.response.data)
      name: "Referral List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const referralSlice = createSlice({
  extraReducers: {
    [getReferrals.pending]: (state) => {
      state.error = null;
      state.loading = true;
      state.referrals = null;
    },
    [getReferrals.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getReferrals.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.referrals = action.payload.referrals;
    },
  },
  initialState: getInitialState(),
  name: "referral",
  reducers: {},
});
const { reducer } = referralSlice;
export default reducer;
