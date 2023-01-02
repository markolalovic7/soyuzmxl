import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthTimezoneOffset } from "../reselect/auth-selector";

export const getInitialState = (sportsTreeCache = {}, sportsTreeData = null) => ({
  error: null,
  loading: false,
  sportsTreeCache, // cache for secondary aux searches
  sportsTreeData,
});

function to2Digits(number) {
  return String(number).padStart(2, "0");
}

function getTimezone(authTimezoneOffset) {
  if (authTimezoneOffset) {
    const timezoneHeader = `${Math.sign(authTimezoneOffset) > 0 ? "+" : ""}${to2Digits(authTimezoneOffset)}:00`;

    return timezoneHeader;
  }
  const offset = new Date().getTimezoneOffset() * -1;
  const offsetHours = offset / 60;
  const offsetMinutes = Math.abs(offset % 60);
  const timezoneHeader = `${Math.sign(offsetHours) > 0 ? "+" : ""}${to2Digits(offsetHours)}:${to2Digits(
    offsetMinutes,
  )}`;

  return timezoneHeader;
}

export const getSportsTree = createAsyncThunk(
  "sportsTree/standardSportsTree",
  async ({ cacheKey, cancelToken, fromDate, standard, toDate }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const authTimezoneOffset = getAuthTimezoneOffset(thunkAPI.getState());

      const sportsTreeType = standard ? "ccoupon" : "acoupon";

      let optionalParams = "";
      if (fromDate) {
        optionalParams = `${optionalParams}&fromDate=${fromDate}`;
      }
      if (toDate) {
        optionalParams = `${optionalParams}&toDate=${toDate}`;
      }

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });
      axios.defaults.headers["timezone"] = getTimezone(authTimezoneOffset);

      const result = await axios.get(
        `/player/ept/${sportsTreeType}?originId=${originId}&lineId=${lineId}${optionalParams}`,
        { cancelToken },
      );

      return {
        cacheKey,
        sportsTreeData: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to obtain the sports tree", // serializable (err.response.data)
        name: "Sports Tree Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

const sportsTreeSlice = createSlice({
  extraReducers: {
    [getSportsTree.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [getSportsTree.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [getSportsTree.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
      if (action.payload.cacheKey) {
        state.sportsTreeCache[action.payload.cacheKey] = action.payload.sportsTreeData;
      } else {
        state.sportsTreeData = action.payload.sportsTreeData;
      }
    },
  },
  initialState: getInitialState(),
  name: "sportsTree",
  reducers: {},
});
const { reducer } = sportsTreeSlice;
export default reducer;
