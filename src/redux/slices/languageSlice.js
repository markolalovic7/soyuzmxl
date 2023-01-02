import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (languages = null) => ({
  error: null,
  languages,
  loading: false,
});

export const getLanguages = createAsyncThunk("languages/loadLanguages", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/languages?originId=${originId}&lineId=${lineId}`);

    return {
      languages: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain language details", // serializable (err.response.data)
      name: "Languages List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const languageSlice = createSlice({
  extraReducers: {
    [getLanguages.pending]: (state) => {
      state.languages = null;
      state.error = null;
      state.loading = true;
    },
    [getLanguages.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getLanguages.fulfilled]: (state, action) => {
      state.error = null;
      state.languages = action.payload.languages;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "language",
  reducers: {},
});
const { reducer } = languageSlice;
export default reducer;
