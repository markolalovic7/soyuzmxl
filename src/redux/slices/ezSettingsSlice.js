import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthAccountId } from "../reselect/auth-selector";

export const getInitialState = () => ({
  autoApprovalMode: "AUTO_ALL",
  custom: false,
  moneyButton1: 10000,
  moneyButton2: 100000,
  moneyButton3: 1000000,
});

export const getSettings = createAsyncThunk("ez/getSettings", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const accountId = getAuthAccountId(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(`/player/acc/${accountId}/ezsettings?originId=${originId}&lineId=${lineId}`);

    return {
      autoApprovalMode: result.data?.autoApprovalMode,
      custom: true,
      moneyButton1: result.data?.moneyButton1,
      moneyButton2: result.data?.moneyButton2,
      moneyButton3: result.data?.moneyButton3,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load EZ settings for the player", // serializable (err.response.data)
      name: "Load EZ Settings Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const saveSettings = createAsyncThunk(
  "ez/saveSettings",
  async ({ autoApprovalMode, moneyButton1, moneyButton2, moneyButton3 }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const accountId = getAuthAccountId(thunkAPI.getState());
      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });

      if (!thunkAPI.getState().ez.custom) {
        const result = await axios.post(`/player/acc/${accountId}/ezsettings?originId=${originId}&lineId=${lineId}`, {
          autoApprovalMode,
          moneyButton1,
          moneyButton2,
          moneyButton3,
        });
      } else {
        const result = await axios.put(`/player/acc/${accountId}/ezsettings?originId=${originId}&lineId=${lineId}`, {
          autoApprovalMode,
          moneyButton1,
          moneyButton2,
          moneyButton3,
        });
      }

      return {
        autoApprovalMode,
        moneyButton1,
        moneyButton2,
        moneyButton3,
        success: true,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to save user settings", // serializable (err.response.data)
        name: "EZ User Settings save error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

const ezSettingsSlice = createSlice({
  extraReducers: {
    [getSettings.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getSettings.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getSettings.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      state.autoApprovalMode = action.payload.autoApprovalMode;
      state.custom = true;
      state.moneyButton1 = action.payload.moneyButton1;
      state.moneyButton2 = action.payload.moneyButton2;
      state.moneyButton3 = action.payload.moneyButton3;
    },
    [saveSettings.pending]: (state) => {
      state.error = null;
      state.saving = true;
    },
    [saveSettings.rejected]: (state, action) => {
      state.error = action.error.message;
      state.saving = false;
    },
    [saveSettings.fulfilled]: (state, action) => {
      state.error = null;
      state.saving = false;

      state.custom = true;
      state.autoApprovalMode = action.payload.autoApprovalMode;
      state.moneyButton1 = action.payload.moneyButton1;
      state.moneyButton2 = action.payload.moneyButton2;
      state.moneyButton3 = action.payload.moneyButton3;
    },
  },
  initialState: getInitialState(),
  name: "ez",
  reducers: {
    //
  },
});
const { actions, reducer } = ezSettingsSlice;
export default reducer;
