import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { convertBlobToBase64 } from "utils/misc";

import createAxiosInstance from "../async/axios";

export const getInitialState = (cachedAssets = {}) => ({
  cachedAssets,
  error: null,
  loading: false,
});

export const loadAsset = createAsyncThunk("assets/loadAsset", async (data, thunkAPI) => {
  try {
    const axios = createAxiosInstance(thunkAPI.dispatch);
    axios.defaults.headers["Content-Type"] = null;
    axios.defaults.headers["Accept"] = "*/*";

    const result = await axios.get(
      `/player/cms/assets/${data.type}/${data.id}?originId=${data.originId}&lineId=${data.lineId}`,
      {
        responseType: "blob",
      },
    );
    const base64Data = await convertBlobToBase64(result.data);

    return { asset: base64Data, assetId: data.id };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain asset", // serializable (err.response.data)
      name: "Asset Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const assetSlice = createSlice({
  extraReducers: {
    [loadAsset.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadAsset.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadAsset.fulfilled]: (state, action) => {
      state.cachedAssets[action.payload.assetId] = action.payload.asset;
      state.error = null;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "assets",
  reducers: {},
});

const { reducer } = assetSlice;
export default reducer;
