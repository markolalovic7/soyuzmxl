import { createAsyncThunk } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getSolidGamingGameUrl = createAsyncThunk("solidGaming/getUrl", async ({ gameCode }, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
    });

    const queryParams = {
      lineId,
      originId,
    };

    const queryString = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");

    const result = await axios.post(`/player/casino?${queryString}`, { gameCode, providerCode: "SG" });

    return {
      events: result.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain game url", // serializable (err.response.data)
      name: "Game URL Fetch Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});
