import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (countries = null) => ({
  countries,
  error: null,
  loading: false,
});

export const getCountries = createAsyncThunk("country/loadCountries", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/countries?originId=${originId}&lineId=${lineId}`);

    return {
      countries: result.data,
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

const countrySlice = createSlice({
  extraReducers: {
    [getCountries.pending]: (state) => {
      state.countries = null;
      state.error = null;
      state.loading = true;
    },
    [getCountries.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getCountries.fulfilled]: (state, action) => {
      state.countries = action.payload.countries;
      state.loading = false;
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "country",
  reducers: {},
});
const { reducer } = countrySlice;
export default reducer;
