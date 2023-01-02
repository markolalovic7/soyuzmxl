import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = () => ({
  error: null,
  loading: false,
  streamHash: {},
});

export const getAVLiveStreamByEvent = createAsyncThunk("avLive/loadAVLiveStreamURL", async ({ eventId }, thunkAPI) => {
  try {
    const { accountId, authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    if (process.env.REACT_APP_SIMULATE_X_FORWARDED_FOR) axios.defaults.headers["x-forwarded-for"] = "173.245.219.241";

    const result = await axios.get(
      `/player/acc/${accountId}/avlive/hls?eventId=${eventId}&originId=${originId}&lineId=${lineId}`,
    );

    return {
      eventId,
      streamUrl: result.data.streamUrl,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain live video stream details", // serializable (err.response.data)
      name: "Video Live Stram Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const avLiveSlice = createSlice({
  extraReducers: {
    [getAVLiveStreamByEvent.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getAVLiveStreamByEvent.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getAVLiveStreamByEvent.fulfilled]: (state, action) => {
      const eventId = action.payload.eventId;

      state.streamHash[eventId] = action.payload.streamUrl;
      state.loading = false;
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "avlive",
  reducers: {
    clearStream(state, action) {
      const eventId = action.payload.eventId;
      delete state.streamHash[eventId];
    },
  },
});
const { actions, reducer } = avLiveSlice;
export const { clearStream } = actions;
export default reducer;
