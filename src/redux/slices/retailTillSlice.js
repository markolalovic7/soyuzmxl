import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { isNotEmpty } from "../../utils/lodash";
import { logout } from "../actions/auth-actions";
import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

import { postTillTransaction } from "./retailTransactionSlice";

export const getInitialState = () => ({
  error: null,
  loading: false,
  mustStartShift: false,
  tillDetails: null,
});

export const loadTillDetails = createAsyncThunk("retailTill/loadTillDetails", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
      `/retail/tills/details?originId=${originId}&lineId=${lineId}`,
    );

    return { tillDetails: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load till information", // serializable (err.response.data)
      name: "Load Till Details Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const loadCurrentShift = createAsyncThunk("retailTill/loadCurrentShift", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
      `/retail/shifts?current=true&originId=${originId}&lineId=${lineId}`,
    );

    return { currentShift: isNotEmpty(result.data) ? result.data[0] : undefined };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load current shift information", // serializable (err.response.data)
      name: "Load Current Shift Info Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const startShift = createAsyncThunk("retailTill/startShift", async ({ adjustment, hasAdjustment }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });

    const result = await axios.post(`/retail/shifts?originId=${originId}&lineId=${lineId}`, {});

    thunkAPI.dispatch(loadCurrentShift());

    if (hasAdjustment) {
      thunkAPI.dispatch(postTillTransaction(adjustment));
    }

    return {
      result: true,
    };
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const endShift = createAsyncThunk("retailTill/endShift", async ({ adjustment, hasAdjustment }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });

    if (hasAdjustment) {
      await thunkAPI.dispatch(postTillTransaction(adjustment));
    }

    const result = await axios.put(`/retail/shifts/end?originId=${originId}&lineId=${lineId}`);

    await thunkAPI.dispatch(loadCurrentShift());

    thunkAPI.dispatch(logout());

    return {
      result: true,
    };
  } catch (err) {
    throw thunkAPI.rejectWithValue(err?.response?.data || err);
  }
});

export const loadTillBalance = createAsyncThunk("retailTill/loadTillBalance", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());

    const result = await createAxiosInstance(thunkAPI.dispatch, { authToken, language, tillAuth }).get(
      `/retail/tills/balance?originId=${originId}&lineId=${lineId}`,
    );

    return { balance: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load till balance", // serializable (err.response.data)
      name: "Load Til Balance Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const retailAccountSlice = createSlice({
  extraReducers: {
    [loadTillDetails.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadTillDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loadTillDetails.fulfilled]: (state, action) => {
      state.tillDetails = action.payload.tillDetails;
      state.error = null;
      state.loading = false;
    },

    [loadCurrentShift.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadCurrentShift.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [loadCurrentShift.fulfilled]: (state, action) => {
      state.currentShift = action.payload.currentShift;
      state.mustStartShift = !!(!action.payload.currentShift || action.payload.currentShift.endDate);
      state.error = null;
      state.loading = false;
    },
    [startShift.pending]: (state) => {
      state.creating = true;
      state.error = null;
    },
    [startShift.rejected]: (state, action) => {
      state.creating = false;
      state.error = action.error.message;
    },
    [startShift.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },

    [loadTillBalance.pending]: (state) => {
      state.loadingBalance = true;
      state.error = null;
    },
    [loadTillBalance.rejected]: (state, action) => {
      state.loadingBalance = false;
      state.error = action.error.message;
    },
    [loadTillBalance.fulfilled]: (state, action) => {
      state.loadingBalance = null;
      state.loading = false;
      state.balance = action.payload.balance;
    },
  },
  initialState: getInitialState(),
  name: "retailTill",
  // reducers actions
  reducers: {
    //
  },
});

const { reducer } = retailAccountSlice;
// export const {  } = actions;
export default reducer;
