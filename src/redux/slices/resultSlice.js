import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";
import { sortByDescription } from "utils/sort/result-sort";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (standardResults = null, mainBookResults = null, detailedEvent = null) => ({
  detailedEvent,
  error: null,
  isDetailedLoading: false,
  loading: false,
  mainBookResults,
  standardResults,
});

// Returns results per period...
let couponCancelToken;

export const getStandardResultSlice = createAsyncThunk(
  "results/loadStandardResults",
  async ({ dateFrom, dateTo }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

      let thisCancelToken = null;
      // Check if there are any previous pending requests
      if (couponCancelToken) {
        // cancel the previous operation...
        couponCancelToken.cancel("Operation canceled due to new request.");
      }
      // Save the cancel token for the current request
      couponCancelToken = originalAxios.CancelToken.source();
      thisCancelToken = couponCancelToken;

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });
      const result = await axios.get(
        `/player/results?originId=${originId}&lineId=${lineId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cancelToken: thisCancelToken.token },
      ); // Pass the cancel token to the current request

      const sortedBySport = {
        ...result.data,
        sports: result.data.sports.sort((a, b) => a.description.localeCompare(b.description)),
      };

      return { standardResults: sortedBySport };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to obtain the result details", // serializable (err.response.data)
        name: "Result Load Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const getMainBook = createAsyncThunk("results/mainBook", async ({ dateFrom, dateTo }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.get(
      `/player/results/mainbook/default?originId=${originId}&lineId=${lineId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    );

    // sort categories and tournaments inside of them by alphabet
    const sports = result.data.map((sport) => ({
      ...sport,
      categories: sortByDescription(sport.categories).map((category) => ({
        ...category,
        tournaments: sortByDescription(category.tournaments),
      })),
    }));

    return {
      mainBookResults: sports,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the result details", // serializable (err.response.data)
      name: "Result Load Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const getMainBookDetailedEvent = createAsyncThunk("results/mainBookDetailed", async ({ eventId }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });
    const result = await axios.get(`/player/results/mainbook/${eventId}?originId=${originId}&lineId=${lineId}`);

    return { detailedEvent: result.data };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the result details", // serializable (err.response.data)
      name: "Result Load Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const resultSlice = createSlice({
  extraReducers: {
    [getStandardResultSlice.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getStandardResultSlice.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getStandardResultSlice.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.standardResults = action.payload.standardResults;
    },
    [getMainBook.pending]: (state) => {
      state.error = null;
      state.loading = true;
      state.mainBookResults = null;
    },
    [getMainBook.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getMainBook.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.mainBookResults = action.payload.mainBookResults;
    },
    [getMainBookDetailedEvent.pending]: (state) => {
      state.detailedEvent = null;
      state.error = null;
      state.isDetailedLoading = true;
    },
    [getMainBookDetailedEvent.rejected]: (state, action) => {
      state.isDetailedLoading = false;
      state.error = action.error.message;
    },
    [getMainBookDetailedEvent.fulfilled]: (state, action) => {
      state.detailedEvent = action.payload.detailedEvent;
      state.error = null;
      state.isDetailedLoading = false;
    },
  },
  initialState: getInitialState(),
  name: "results",
  reducers: {},
});
const { reducer } = resultSlice;
export default reducer;
