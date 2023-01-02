import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";
import merge from "lodash.merge";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import { getAuthPriceFormat } from "../reselect/auth-selector";

export const getInitialState = (couponData = {}, asianCouponData = {}) => ({
  activeSearchKeyword: null,
  asianCouponData,
  asianCouponError: {},
  asianCouponFromTimestamp: {},
  asianCouponLoading: {},
  couponData, // keep a map of all data per search code (events and paths)
  couponError: {},
  couponFromTimestamp: {}, // keep a map of all timestamps per search code (events and paths)
  couponLoading: {}, // keep a map of all loading states per search code (events and paths)
  searchCouponData: null,
  searchError: null,
  searchFromTimestamp: null,
  searchLoading: false,
});

function prepareParams(originId, lineId, data) {
  let params = `originId=${originId}&lineId=${lineId}`;

  const eventType = data["eventType"] ? data["eventType"] : null;
  if (eventType) params += `&eventType=${eventType}`;

  const allMarkets = data["allMarkets"];
  if (allMarkets) params += `&ext=1`;

  const live = data["live"];
  if (live) params += `&live=1`;

  const virtual = data["virtual"];
  if (virtual) params += `&virtual=${virtual}`;

  const icon = data["icon"];
  if (icon) params += `&icon=${icon}`;

  if (data["codes"] && data["couponFromTimestamp"]) {
    const from = data["codes"] ? (data["couponFromTimestamp"] ? data["couponFromTimestamp"] : null) : null;
    if (from) params += `&from=${from}`;
  } else if (data["searchFromTimestamp"]) {
    const from = data["searchFromTimestamp"];
    if (from) params += `&from=${from}`;
  }

  const fromDate = data["fromDate"];
  if (fromDate) params += `&fromDate=${fromDate}`;

  const toDate = data["toDate"];
  if (toDate) params += `&toDate=${toDate}`;

  const marketTypeGroups = data["marketTypeGroups"];
  if (marketTypeGroups) params += `&marketTypeGroups=${marketTypeGroups}`;

  const shortNames = data["shortNames"]; // shortnames is true/false
  if (shortNames) params += `&shortNames=1`;

  // const count = data["count"];
  // if (count) params += `&count=${count}`;

  const keywordSearch = data["keywordSearch"];
  if (keywordSearch) params += `&keywordSearch=${keywordSearch}`;

  const compactSpread = data["compactSpread"];
  if (compactSpread) params += `&compactSpread=true`;

  const cmsMarketFilter = data["cmsMarketFilter"];
  if (cmsMarketFilter) params += `&cmsMarketFilter=true`;

  return params;
}

function formatCouponData(data) {
  // Notice this method modifies the original response objects. We are not performing a deep clone for performance reasons, but it can be done in the future if this causes trouble with the logic.
  const couponData = {}; // change the data structure to make it hierarchical and easier to render later on in the components
  for (const [key, item] of Object.entries(data["items"])) {
    item["id"] = parseInt(key.substring(1, key.length), 10);
    item["type"] = key.substring(0, 1);
    switch (item["type"]) {
      case "m":
        item["open"] = !(item["flags"] && (item["flags"].includes("suspended") || item["flags"].includes("closed")));
        item["reserve"] = item["flags"] && (item["flags"].includes("reserved") || item["flags"].includes("Reserve"));
        break;
      case "o":
        item["hidden"] = !!(item["flags"] && item["flags"].includes("hidden"));
        delete item["flags"]; // does not play well with merges in the reducer...
        break;
      default:
        break;
    }

    if (item["parent"] === undefined || item["parent"] === null || item["parent"] === "p0") {
      // add a root element
      couponData[key] = item;
    } else {
      const parentItem = data["items"][item["parent"]];
      if (!parentItem["children"]) {
        parentItem["children"] = {};
      }
      parentItem["children"][key] = item;
    }
  }

  return couponData;
}

const couponCancelToken = {};

export const loadCouponData = createAsyncThunk("coupon/loadCouponData", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const priceFormat = getAuthPriceFormat(thunkAPI.getState());

    const isCmsMarketTypeFilterOn = !!data["cmsMarketFilter"];

    const codes = data["codes"];
    const codesForTracking = isCmsMarketTypeFilterOn ? `cms-${codes}` : codes;
    let thisCancelToken = null;
    // Check if there are any previous pending requests

    if (couponCancelToken[codesForTracking]) {
      // cancel the previous operation...
      couponCancelToken[codesForTracking].cancel("Operation canceled due to new request.");
    }
    // Save the cancel token for the current request
    couponCancelToken[codesForTracking] = originalAxios.CancelToken.source();
    thisCancelToken = couponCancelToken[codesForTracking];

    const couponFromTimestamp = thunkAPI.getState().coupon.couponFromTimestamp[codesForTracking];
    const params = prepareParams(originId, lineId, {
      ...data,
      couponFromTimestamp,
    });

    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language });
    if (priceFormat) {
      axios.defaults.headers["x-priceformat"] = priceFormat;
    }

    let result = null;
    if (data["count"]) {
      const nextCount = data["count"];

      result = await axios.get(`/player/next/${nextCount}/${codes}?${params}`, {
        cancelToken: thisCancelToken.token,
      }); // Pass the cancel token to the current request
    } else {
      result = await axios.get(`/player/sdc/${codes}?${params}`, { cancelToken: thisCancelToken.token }); // Pass the cancel token to the current request
    }

    delete couponCancelToken[codesForTracking];

    return {
      cmsMarketFilterOnMode: isCmsMarketTypeFilterOn,
      couponData: formatCouponData(result.data),
      couponFromTimestamp: result.data["toTimestamp"],
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load coupon data", // serializable (err.response.data)
      name: "Load Coupon Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const asianCouponCancelToken = {};

export const loadAsianCouponData = createAsyncThunk("coupon/loadAsianCouponData", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const priceFormat = getAuthPriceFormat(thunkAPI.getState());

    const codes = data["codes"];
    const sportCode = data["sportCode"];

    let thisCancelToken = null;
    // Check if there are any previous pending requests

    if (asianCouponCancelToken[codes]) {
      // cancel the previous operation...
      asianCouponCancelToken[codes].cancel("Operation canceled due to new request.");
    }
    // Save the cancel token for the current request
    asianCouponCancelToken[codes] = originalAxios.CancelToken.source();
    thisCancelToken = asianCouponCancelToken[codes];

    const couponFromTimestamp = thunkAPI.getState().coupon.couponFromTimestamp[codes];
    const params = prepareParams(originId, lineId, {
      ...data,
      couponFromTimestamp,
    });

    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language });
    if (priceFormat) {
      axios.defaults.headers["x-priceformat"] = priceFormat;
    }

    let result = null;
    if (data["count"]) {
      const nextCount = data["count"];

      result = await axios.get(`/player/next/${nextCount}/${codes.split("/")[0]}/${codes.split("/")[1]}?${params}`, {
        cancelToken: thisCancelToken.token,
      }); // Pass the cancel token to the current request
    } else {
      result = await axios.get(`/player/sdc/acoupon/${codes.split("/")[0]}/${codes.split("/")[1]}?${params}`, {
        cancelToken: thisCancelToken.token,
      }); // Pass the cancel token to the current request
    }

    delete asianCouponCancelToken[codes];

    return { couponData: formatCouponData(result.data), couponFromTimestamp: result.data["toTimestamp"] };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load coupon data", // serializable (err.response.data)
      name: "Load Coupon Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

let searchCancelToken = null;
export const searchForCouponData = createAsyncThunk("coupon/searchCouponData", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
    const priceFormat = getAuthPriceFormat(thunkAPI.getState());

    let thisCancelToken = null;
    // Check if there are any previous pending requests
    if (searchCancelToken) {
      // cancel the previous operation...
      searchCancelToken.cancel("Operation canceled due to new request.");
    }
    // Save the cancel token for the current request
    searchCancelToken = originalAxios.CancelToken.source();
    thisCancelToken = searchCancelToken;

    const searchFromTimestamp = thunkAPI.getState().coupon.searchFromTimestamp;

    const params = prepareParams(originId, lineId, { ...data, searchFromTimestamp });

    const keyword = data["keyword"];

    const axios = createAxiosInstance(thunkAPI.dispatch, { authToken, language });
    if (priceFormat) {
      axios.defaults.headers["x-priceformat"] = priceFormat;
    }

    const result = await axios.get(`/player/sdc/search/${keyword}?${params}`, { cancelToken: thisCancelToken.token }); // Pass the cancel token to the current request

    const couponData = formatCouponData(result.data);

    return {
      activeSearchKeyword: keyword,
      searchCouponData: couponData,
      searchFromTimestamp: result.data["toTimestamp"],
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to load coupon data", // serializable (err.response.data)
      name: "Load Coupon Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const couponSlice = createSlice({
  extraReducers: {
    [loadAsianCouponData.pending]: (state, action) => {
      const codes = action.meta?.arg?.codes;
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!codes) {
        return;
      }
      state.asianCouponLoading[codes] = true;
      state.asianCouponError[codes] = null;
    },
    [loadAsianCouponData.rejected]: (state, action) => {
      const codes = action.meta?.arg?.codes;
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!codes) {
        return;
      }
      state.asianCouponLoading[codes] = false;
      state.asianCouponError[codes] = action.error.message;
    },
    [loadAsianCouponData.fulfilled]: (state, action) => {
      const codes = action.meta?.arg?.codes;
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!codes) {
        return;
      }
      state.asianCouponLoading[codes] = false;

      if (action.payload.couponData) {
        if (!state.asianCouponData[codes]) {
          state.asianCouponData[codes] = action.payload.couponData;
        } else {
          state.asianCouponData[codes] = merge(state.couponData[codes], action.payload.couponData);
        }
        state.asianCouponFromTimestamp[codes] = action.payload.couponFromTimestamp;
      }
    },
    [loadCouponData.pending]: (state, action) => {
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!action.meta?.arg?.codes) {
        return;
      }

      const codes = action.meta?.arg?.cmsMarketFilter ? `cms-${action.meta?.arg?.codes}` : action.meta?.arg?.codes;
      state.couponLoading[codes] = true;
      state.couponError[codes] = null;
    },
    [loadCouponData.rejected]: (state, action) => {
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!action.meta?.arg?.codes) {
        return;
      }

      const codes = action.meta?.arg?.cmsMarketFilter ? `cms-${action.meta?.arg?.codes}` : action.meta?.arg?.codes;
      state.couponLoading[codes] = false;
      state.couponError[codes] = action.error.message;
    },
    [loadCouponData.fulfilled]: (state, action) => {
      // Note: When`codes` is undefined, no need to add `undefined` key to `couponLoading` and `couponError`.
      if (!action.meta?.arg?.codes) {
        return;
      }

      const codes = action.meta?.arg?.cmsMarketFilter ? `cms-${action.meta?.arg?.codes}` : action.meta?.arg?.codes;
      state.couponLoading[codes] = false;

      if (action.payload.couponData) {
        if (!state.couponData[codes]) {
          state.couponData[codes] = action.payload.couponData;
        } else {
          state.couponData[codes] = merge(state.couponData[codes], action.payload.couponData);
        }
        state.couponFromTimestamp[codes] = action.payload.couponFromTimestamp;
      }
    },
    [searchForCouponData.pending]: (state) => {
      // state.searchCouponData = null;
      state.searchError = null;
      state.searchLoading = true;
    },
    [searchForCouponData.rejected]: (state, action) => {
      state.searchError = action.error.message;
      state.searchLoading = false;
    },
    [searchForCouponData.fulfilled]: (state, action) => {
      state.searchLoading = false;
      state.searchCouponData = merge(state.searchCouponData ?? {}, action.payload.searchCouponData);
      state.searchFromTimestamp = action.payload.searchFromTimestamp;
    },
  },
  initialState: getInitialState(),
  name: "coupon",
  reducers: {
    clearAsianCoupon(state, action) {
      const codes = action.payload.codes;
      delete state.asianCouponData[codes];
      delete state.asianCouponFromTimestamp[codes];
      delete state.asianCouponError[codes];
    },
    clearCoupon(state, action) {
      const cmsMarketFilter = action.payload.cmsMarketFilter;
      const codes = action.payload.codes;
      const decoratedCodes = cmsMarketFilter ? `cms-${codes}` : codes;
      delete state.couponData[decoratedCodes];
      delete state.couponFromTimestamp[decoratedCodes];
      delete state.couponError[decoratedCodes];
    },
    clearSearchResults(state) {
      state.activeSearchKeyword = null;
      state.searchCouponData = null;
      state.searchFromTimestamp = null;
    },
  },
});
const { actions, reducer } = couponSlice;
export const { clearAsianCoupon, clearCoupon, clearSearchResults } = actions;
export default reducer;
