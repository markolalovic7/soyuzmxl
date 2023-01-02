import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (currencies = null) => ({
  currencies,
  error: null,
  loading: false,
});

export const getCurrencies = createAsyncThunk("currencies/loadCurrencies", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/currencies?originId=${originId}&lineId=${lineId}`);

    return {
      currencies: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain currency details", // serializable (err.response.data)
      name: "Currency List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const currencySlice = createSlice({
  extraReducers: {
    [getCurrencies.pending]: (state) => {
      state.currencies = null;
      state.error = null;
      state.loading = true;
    },
    [getCurrencies.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getCurrencies.fulfilled]: (state, action) => {
      state.currencies = action.payload.currencies;
      state.error = null;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "currency",
  reducers: {},
});
const { reducer } = currencySlice;
export default reducer;
