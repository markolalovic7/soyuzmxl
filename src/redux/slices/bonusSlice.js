import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = () => ({
  availablePromotions: [],
  error: null,
  loading: false,
});

export const getAvailablePromotions = createAsyncThunk("bonus/getAvailablePromotions", async (data, thunkAPI) => {
  try {
    const { accountId, authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(
      `/player/${accountId ? `acc/${accountId}/` : ""}bonus/availablepromotions?originId=${originId}&lineId=${lineId}`,
    );

    return {
      availablePromotions: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain available bonus promotions", // serializable (err.response.data)
      name: "Bonus promotion list Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const bonusSlice = createSlice({
  extraReducers: {
    [getAvailablePromotions.pending]: (state) => {
      state.availablePromotions = null;
      state.error = null;
      state.loading = true;
    },
    [getAvailablePromotions.rejected]: (state, action) => {
      state.availablePromotions = action.error.message;
      state.loading = false;
    },
    [getAvailablePromotions.fulfilled]: (state, action) => {
      state.availablePromotions = action.payload.availablePromotions;
      state.loading = false;
      state.error = null;
    },
  },
  initialState: getInitialState(),
  name: "bonus",
  reducers: {},
});
const { reducer } = bonusSlice;
export default reducer;
