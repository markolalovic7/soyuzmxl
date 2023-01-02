import { createAsyncThunk } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getVirtualKironEvents = createAsyncThunk(
  "virtualKiron/loadEvents",
  async ({ dateFrom, dateTo, feedCode, sportCode }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });

      const queryParams = {
        dateFrom,
        dateTo,
        feedCode,
        lineId,
        originId,
        sportCode,
      };

      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&");

      const result = await axios.get(`/player/kiron/settledEvents?${queryString}`);

      return {
        events: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response?.headers["x-information"] || "Unable to obtain language details", // serializable (err.response.data)
        name: "Kiron events List Fetch Error",
        status: err.response?.statusText,
      };
      throw customError;
    }
  },
);

export const getVirtualKironResult = createAsyncThunk("virtualKiron/loadResult", async ({ eventId }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const queryParams = {
      eventId,
      lineId,
      originId,
    };

    const queryString = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");

    const result = await axios.get(`/player/kiron/result?${queryString}`);

    return {
      results: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain language details", // serializable (err.response.data)
      name: "Kiron Results List Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});
