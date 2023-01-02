import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (sports = null) => ({
  error: null,
  loading: false,
  sports,
});

export const getSports = createAsyncThunk("sports/loadAll", async ({ cancelToken, lineId, originId }, thunkAPI) => {
  try {
    const { authToken, language } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/sports?originId=${originId}&lineId=${lineId}`, {
      cancelToken,
    });

    const map = {};
    result.data.forEach((sport) => {
      map[sport.code] = sport;
    });

    return {
      sports: map,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the sports tree", // serializable (err.response.data)
      name: "Sports Tree Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const sportSlice = createSlice({
  extraReducers: {
    [getSports.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getSports.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getSports.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.sports = action.payload.sports;
    },
  },
  initialState: getInitialState(),
  name: "sport",
  reducers: {},
});
const { reducer } = sportSlice;
export default reducer;
