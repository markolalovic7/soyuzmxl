import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (config = null, originId = null) => ({
  config,
  error: null,
  lineId: null,
  loading: false,
  originId,
});

export const getCmsConfig = createAsyncThunk("cms/loadConfig", async ({ cancelToken, lineId, originId }, thunkAPI) => {
  try {
    const { authToken, language } = getRequestParams(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language });

    const result = await axios.get(`/player/cms/config?originId=${originId}&lineId=${lineId}`, {
      cancelToken,
    });

    return {
      config: result.data,
      lineId,
      originId,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the cms config", // serializable (err.response.data)
      name: "CMS Config Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const cmsSlice = createSlice({
  extraReducers: {
    [getCmsConfig.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getCmsConfig.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getCmsConfig.fulfilled]: (state, action) => {
      state.config = action.payload.config;
      state.error = null;
      state.lineId = action.payload.lineId;
      state.loading = false;
      state.originId = action.payload.originId;
    },
  },
  initialState: getInitialState(),
  name: "cms",
  reducers: {},
});
const { reducer } = cmsSlice;

export default reducer;
