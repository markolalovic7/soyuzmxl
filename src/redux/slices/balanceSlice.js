import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";

export const getInitialState = (balance = null, singleWalletBalance = null) => ({
  balance,
  error: null,
  loading: false,
  singleWalletBalance,
});

export const loadBalance = createAsyncThunk("balance/load", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/acc/${accountId}/balance?originId=${originId}&lineId=${lineId}`);

    return { balance: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load account balance", // serializable (err.response.data)
      name: "Load Account Balance Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const loadSingleWalletBalance = createAsyncThunk("balance/loadSingleWalletBalance", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/acc/${accountId}/singlewallet/bal?originId=${originId}&lineId=${lineId}`);

    return { singleWalletBalance: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load account balance", // serializable (err.response.data)
      name: "Load Account Balance Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const balanceSlice = createSlice({
  extraReducers: {
    [loadBalance.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadBalance.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadBalance.fulfilled]: (state, action) => {
      state.balance = action.payload.balance;
      state.error = null;
      state.loading = false;
    },
    [loadSingleWalletBalance.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadSingleWalletBalance.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadSingleWalletBalance.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.singleWalletBalance = action.payload.singleWalletBalance;
    },
  },
  initialState: getInitialState(),
  name: "balance",
  reducers: {},
});
const { reducer } = balanceSlice;
export default reducer;
