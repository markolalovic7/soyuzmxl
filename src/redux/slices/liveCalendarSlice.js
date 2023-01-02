import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getInitialState = (liveCalendarData = null) => ({
  error: null,
  liveCalendarData,
  loading: false,
});

const formatData = (items) => {
  const result = [];
  if (items) {
    const now = dayjs();

    const values = Object.entries(items)
      .map((item) => ({
        category: item[1].path["Country/Region"],
        countryCode: item[1].countryCode,
        description: item[1].desc,
        epoch: item[1].epoch,
        id: item[0].substring(1, item[0].length),
        sportCode: item[1].code,
        tournament: item[1].pdesc,
        tournamentId: parseInt(item[1].parent.substring(1, item[1].parent.length), 10),
      }))
      .filter((item) => dayjs.unix(item.epoch / 1000).isAfter(now));

    result.push(...values);
  }

  return result;
};

export const loadLiveCalendarData = createAsyncThunk("liveCalendar/loadLiveCalendarData", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const fromDate = `${dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
    const endDate = `${dayjs()
      .add(7, "day")
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const result = await axios.get(
      `/player/sdc/calendar?lineId=${lineId}&originId=${originId}&fromDate=${fromDate}&toDate=${endDate}`,
    );

    const liveCalendarData = formatData(result.data.items);

    return { liveCalendarData };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load live calendar data", // serializable (err.response.data)
      name: "Load Live Calendar Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const liveCalendarSlice = createSlice({
  extraReducers: {
    [loadLiveCalendarData.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [loadLiveCalendarData.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loadLiveCalendarData.fulfilled]: (state, action) => {
      state.error = null;
      state.liveCalendarData = action.payload.liveCalendarData;
      state.loading = false;
    },
  },
  initialState: getInitialState(),
  name: "liveCalendar",
  reducers: {},
});
const { reducer } = liveCalendarSlice;
export default reducer;
