import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (gameList = null) => ({
  error: null,
  gameList,
  loading: false,
});

export const getSolidGamingGameList = createAsyncThunk("solidGaming/loadGameList", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language });

    const result = await axios.get(`/player/casino/list/sg?originId=${originId}&lineId=${lineId}`);

    return {
      gameList: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain the Solid Gaming game List", // serializable (err.response.data)
      name: "Solid Gaming game list fetchError",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const solidGamingSlice = createSlice({
  extraReducers: {
    [getSolidGamingGameList.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getSolidGamingGameList.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getSolidGamingGameList.fulfilled]: (state, action) => {
      state.gameList = action.payload.gameList;
      state.error = null;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "solidGaming",
  reducers: {},
});
const { reducer } = solidGamingSlice;

export default reducer;
