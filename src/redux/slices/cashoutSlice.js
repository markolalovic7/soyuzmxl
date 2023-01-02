import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";
import { loadBalance, loadSingleWalletBalance } from "./balanceSlice";
import { getCmsConfigBrandDetails } from "../reselect/cms-selector";

export const getInitialState = (activeBetCount = 0, cashableBetCount = 0, activeBets = []) => ({
  activeBetCount,
  activeBets,
  cashableBetCount,
  cashoutConfirmed: false,
  cashoutFailed: false,
  cashoutProcessing: false,
  error: null,
  loading: false,
  loadingCount: false,
});

let allCountCancelToken = null;

export const getActiveBetCount = createAsyncThunk("cashout/activeBetCount", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    if (allCountCancelToken) {
      allCountCancelToken.cancel("Operation canceled due to newer incoming request.");
    }

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    // Save the cancel token for the current request
    allCountCancelToken = originalAxios.CancelToken.source();

    const result = await axios.get(`/player/acc/${accountId}/cashout/allCount?originId=${originId}&lineId=${lineId}`, {
      cancelToken: allCountCancelToken.token,
    }); // Pass the cancel token to the current request;

    return {
      activeBetCount: result.data.activeBetCount,
      cashableBetCount: result.data.cashableBetCount,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the active bet count", // serializable (err.response.data)
      name: "Active Bet Count Retrieval Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const getActiveBetDetail = createAsyncThunk("cashout/activeBetDetail", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.get(
      `/player/acc/${accountId}/cashout/allDetails?originId=${originId}&lineId=${lineId}${
        data?.compactSpread ? "&compactSpread=true" : ""
      }`,
    );

    return {
      activeBets: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the active bet count", // serializable (err.response.data)
      name: "Active Bet Count Retrieval Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const getFreshQuotation = createAsyncThunk("cashout/quote", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const body = { betBucketId: data["betBucketId"], quote: data["quote"] };

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.put(
      `/player/acc/${accountId}/cashout/details?originId=${originId}&lineId=${lineId}&compactSpread=${
        data.compactSpread || false
      }`,
      body,
    );

    return {
      activeBet: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the active bet count", // serializable (err.response.data)
      name: "Active Bet Count Retrieval Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const cashout = createAsyncThunk(
  "cashout/cashout",
  async ({ betBucketId, percentage, quote, stake }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const accountId = getAuthAccountId(thunkAPI.getState());
      const cmsConfigBrandDetails = getCmsConfigBrandDetails(thunkAPI.getState());

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });
      const result = await axios.post(`/player/acc/${accountId}/cashout?originId=${originId}&lineId=${lineId}`, {
        betBucketId,
        lineId,
        originId,
        percentage,
        quote,
        stake,
      });

      if (result.data?.request?.statusId !== 1) {
        throw new Error("Cashout was rejected due to bet changes");
      }

      // thunkAPI.dispatch(getActiveBetDetail()); // refresh cleanly after a cashout... No longer done here, we do it after a cashout confirmation (user clicks OK)
      thunkAPI.dispatch(getActiveBetCount()); // refresh cleanly after a cashout...

      // Get me the latest balance...
      if (cmsConfigBrandDetails?.data?.singleWalletMode) {
        setTimeout(() => {
          thunkAPI.dispatch(loadSingleWalletBalance());
        }, 3000);
      } else {
        thunkAPI.dispatch(loadBalance());
      }

      return {
        activeBet: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to cashout", // serializable (err.response.data)
        name: "Cashout Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

const cashoutSlice = createSlice({
  extraReducers: {
    [getActiveBetCount.pending]: (state) => {
      state.error = null;
      state.loadingCount = true;
    },
    [getActiveBetCount.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loadingCount = false;
    },
    [getActiveBetCount.fulfilled]: (state, action) => {
      state.activeBetCount = action.payload.activeBetCount;
      state.cashableBetCount = action.payload.cashableBetCount;
      state.error = null;
      state.loadingCount = false;
    },
    [getActiveBetDetail.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getActiveBetDetail.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getActiveBetDetail.fulfilled]: (state, action) => {
      state.activeBets = action.payload.activeBets;
      state.error = null;
      state.loading = false;
    },
    [getFreshQuotation.pending]: (state) => {
      state.error = null;
    },
    [getFreshQuotation.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [getFreshQuotation.fulfilled]: (state, action) => {
      state.error = null;
      if (!action.payload.activeBet) {
        return;
      }
      const { betBucketId } = action.payload.activeBet;
      const betIndex = state.activeBets.findIndex((activeBet) => activeBet.betBucketId === betBucketId);
      if (betIndex === -1) {
        return;
      }
      state.activeBets[betIndex] = action.payload.activeBet;
    },
    [cashout.pending]: (state) => {
      state.cashoutProcessing = true;
      state.error = null;
    },
    [cashout.rejected]: (state, action) => {
      state.cashoutProcessing = false;
      state.cashoutFailed = true;
      state.error = action.error.message;
    },
    [cashout.fulfilled]: (state) => {
      state.cashoutProcessing = false;
      state.cashoutConfirmed = true;
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "cashout",
  reducers: {
    clearCashoutState(state) {
      state.cashoutFailed = false;
      state.cashoutConfirmed = false;
    },
  },
});
const { actions, reducer } = cashoutSlice;
export const { clearCashoutState } = actions;
export default reducer;
