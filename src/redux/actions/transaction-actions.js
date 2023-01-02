import { createAsyncThunk } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthSelector } from "../reselect/auth-selector";

export const getBetslipTransactionHistory = createAsyncThunk(
  "transaction/loadBetTransactionHistory",
  async ({ cancelToken, dateFrom, dateTo, settled }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const { accountId, priceFormat } = getAuthSelector(thunkAPI.getState());
      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });
      axios.defaults.headers["Accept"] = "*/*";
      axios.defaults.headers["X-P8-PriceFormat"] = priceFormat;

      const queryParams = {
        dateFrom,
        dateTo,
        lineId,
        numberPerPage: 500,
        originId,
        settled,
        type: "all",
      };

      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&");

      const result = await axios.get(`/player/acc/${accountId}/activity/bets?${queryString}`, {
        cancelToken,
      });

      return {
        betslipTransactions: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response.headers["x-information"] || "Unable to obtain country details", // serializable (err.response.data)
        name: "Country list Fetch Error",
        status: err.response.statusText,
      };
      throw customError;
    }
  },
);

export const getTransactionHistory = createAsyncThunk(
  "transaction/loadTransactionHistory",
  async ({ cancelToken, dateFrom, dateTo, settled }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const { accountId, priceFormat } = getAuthSelector(thunkAPI.getState());
      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });
      axios.defaults.headers["Accept"] = "*/*";
      axios.defaults.headers["X-P8-PriceFormat"] = priceFormat;

      const queryParams = {
        dateFrom,
        dateTo,
        lineId,
        numberPerPage: 500,
        originId,
        settled,
      };

      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&");

      const result = await axios.get(`/player/acc/${accountId}/activity/transactions?${queryString}`, {
        cancelToken,
      });

      return {
        transactions: result.data,
      };
    } catch (err) {
      const customError = {
        message: err.response.headers["x-information"] || "Unable to obtain country details", // serializable (err.response.data)
        name: "Country list Fetch Error",
        status: err.response.statusText,
      };
      throw customError;
    }
  },
);
