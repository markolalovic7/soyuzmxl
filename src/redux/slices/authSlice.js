import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import originalAxios from "axios";
import isEmpty from "lodash.isempty";

import {
  AUTH_SET_DESKTOP_THEME,
  AUTH_SET_DESKTOP_VIEW,
  AUTH_SET_MOBILE_THEME,
  AUTH_SET_MOBILE_VIEW,
  AUTH_SET_TOKEN,
} from "../actions/auth-actions";
import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";
import backdoor from "../utils/reduxBackdoor";

import { createAccount, loadAccountData } from "./accountSlice";
import { assignChatSession } from "./chatSlice";
import { getCmsConfig } from "./cmsSlice";

import {
  CMS_CONFIG_TYPE_APPEARANCE,
  CMS_CONFIG_TYPE_BETTING,
  CMS_CONFIG_TYPE_BRAND_DETAILS,
} from "constants/cms-config-types";

function getDefaultDesktopView(appearanceConfig) {
  const {
    data: { desktopViews },
  } = appearanceConfig || { data: {} };
  if (isEmpty(desktopViews)) {
    return undefined;
  }

  return Object.values(desktopViews).find((desktopView) => desktopView.defaultView)?.desktopView;
}

function getDefaultMobileView(appearanceConfig) {
  const {
    data: { mobileViews },
  } = appearanceConfig || { data: {} };
  if (isEmpty(mobileViews)) {
    return undefined;
  }

  return Object.values(mobileViews).find((mobileView) => mobileView.defaultView)?.mobileView;
}

function getDefaultMobileTheme(appearanceConfig) {
  // temporary - preparation for cms integration
  const defaultView = getDefaultMobileView(appearanceConfig);

  return defaultView === "VANILLA" ? "LUCKY_RED_THEME" : "KOREAN_THEME";
}

function isIframe() {
  /// https://stackoverflow.com/a/326076
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // Browsers can block access to window.top due to same origin policy
  }
}

export const getInitialState = ({
  accountId = null,
  authIFrameQueryParamsProcessed = false,
  authLoginURL,
  authToken = null,
  currencyCode = null,
  desktopTheme = null,
  desktopView = null,
  isSplitModePreferred = false,
  language = null,
  loggedIn = false,
  mobileTheme = null,
  mobileView = null,
  priceFormat = null,
  rememberedUsername = "",
  tillAuth = null,
  timezoneOffset,
  username = null,
}) => ({
  accountId,
  authIFrameQueryParamsProcessed,
  authLoginURL,
  authToken,
  currencyCode,
  desktopTheme,
  desktopView,
  error: null,
  isIframe: isIframe(),
  isSplitModePreferred,
  language,
  loading: false,
  loggedIn,
  mobileTheme,
  mobileView,
  priceFormat,
  rememberedUsername,
  tillAuth,
  timezoneOffset: timezoneOffset || -(new Date().getTimezoneOffset() / 60),
  username,
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const { authToken, language, lineId, originId, tillAuth } = getRequestParams(thunkAPI.getState());
    const { isOperator, isRetail, password, username } = data;

    const axios = createAxiosInstance(thunkAPI.dispatch, {
      authToken,
      language,
      tillAuth,
    });

    // if we are in a betpoint till, force the call through the retail endpoint, just so we force a till validation
    const loginResult = await axios.post(
      isRetail ? `/retail/login/${isOperator ? "operator" : "player"}/${username}` : `/player/acc/id/${username}`,
      {
        lineId,
        originId,
        password,
      },
    );

    if (thunkAPI.getState().chat?.sessionId) {
      // If the user was in the middle of an anonymous chat, do assign the chat to this logged in account.
      thunkAPI.dispatch(
        assignChatSession({ accountId: loginResult.data.id, chatSessionId: thunkAPI.getState().chat?.sessionId }),
      );
    }

    return {
      accountId: loginResult.data.id,
      authToken: loginResult.data.hsToken,
      currencyCode: loginResult.data.currencyCode,
      rememberedUsername: data.rememberMe ? data.username : "",
      username: loginResult.data.username,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || err.response?.data?.errors?.toString() || "Unable to login", // serializable (err.response.data)
      name: "Login Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const forceLogin = createAsyncThunk("auth/forceLogin", async ({ accountId, authToken, language }, thunkAPI) => {
  try {
    const { lineId, originId } = getRequestParams(thunkAPI.getState());

    await thunkAPI.dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));

    const accountData = thunkAPI.getState().account.accountData;

    if (!accountData) {
      return thunkAPI.rejectWithValue("No user found");
    }

    return {
      accountId,
      authToken,
      currencyCode: thunkAPI.getState().account.accountData.currencyCode,
      language,
      username: thunkAPI.getState().account.accountData.username,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || err.response?.data?.errors?.toString() || "Unable to login", // serializable (err.response.data)
      name: "Login Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

export const loadRetailUUID = createAsyncThunk("auth/loadRetailUUID", async (data, thunkAPI) => {
  try {
    // This is basically the user's localhost (with a change in /etc/hosts). Please check the Ringfence or BridgeSocket docs for more details
    const uuidResult = await originalAxios.get("https://bridgesocket.platform8.software:8889/uuid");

    return {
      uuid: uuidResult.data,
    };
  } catch (err) {
    const customError = {
      message: err.response?.headers["x-information"] || "Unable to obtain UUID", // serializable (err.response.data)
      name: "UUID retrieval Error",
      status: err.response?.statusText,
    };
    throw customError;
  }
});

const authSlice = createSlice({
  extraReducers: {
    [AUTH_SET_DESKTOP_THEME]: (state, action) => {
      state.desktopTheme = action.payload.desktopTheme;
    },
    [AUTH_SET_DESKTOP_VIEW]: (state, action) => {
      state.desktopView = action.payload.desktopView;
    },
    [AUTH_SET_MOBILE_THEME]: (state, action) => {
      state.mobileTheme = action.payload.mobileTheme;
    },
    [AUTH_SET_MOBILE_VIEW]: (state, action) => {
      state.mobileView = action.payload.mobileView;
    },
    [AUTH_SET_TOKEN]: (state, action) => {
      if (state.loggedIn && state.accountId) {
        // protect against spurious / race condition changes
        state.authToken = action.payload.authToken;
      }

      // This is conflictive because on login, it arrives before we process the accountId details.
      // unclear why this is here - possibly a requirement or workaround for single wallet query param login.
      // Commented out so we can better identify and correct the root cause.
      // state.loggedIn = true;
    },
    [getCmsConfig.fulfilled]: (state, action) => {
      const {
        config: { siteConfigs },
      } = action.payload || { config: {} };
      const appearanceConfig = siteConfigs?.find(({ configType }) => configType === CMS_CONFIG_TYPE_APPEARANCE);
      const bettingConfig = siteConfigs?.find(({ configType }) => configType === CMS_CONFIG_TYPE_BETTING);
      const brandDetailsConfig = siteConfigs?.find(({ configType }) => configType === CMS_CONFIG_TYPE_BRAND_DETAILS);

      const {
        data: { defaultCurrency, defaultLanguage },
      } = brandDetailsConfig || { data: {} };
      const {
        data: { defaultPriceFormat },
      } = bettingConfig || { data: {} };

      const language = defaultLanguage ? defaultLanguage.toLowerCase() : "en";

      state.currencyCode = state.currencyCode ?? defaultCurrency ?? "USD";
      state.priceFormat = state.priceFormat ?? defaultPriceFormat ?? "EURO";
      state.language = state.language ?? language;
      state.desktopView = state.desktopView ?? getDefaultDesktopView(appearanceConfig);
      state.mobileView = state.mobileView ?? getDefaultMobileView(appearanceConfig);
      state.mobileTheme = state.mobileTheme ?? getDefaultMobileTheme(appearanceConfig);
      // Hack: `liveSlice` uses `language`, `priceFormat` but has no direct access to this state.
      // Therefore, update them when in redux values changed..
      backdoor.language = state.language;
      backdoor.priceFormat = state.priceFormat;
    },
    [login.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
      state.loggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.accountId = action.payload.accountId;
      state.authToken = action.payload.authToken;
      state.currencyCode = action.payload.currencyCode;
      state.error = null;
      state.loading = false;
      state.loggedIn = true;
      state.rememberedUsername = action.payload.rememberedUsername;
      state.username = action.payload.username;
    },
    [loadRetailUUID.pending]: (state) => {
      // do nothing
    },
    [loadRetailUUID.rejected]: (state) => {
      state.tillAuth = null;
    },
    [loadRetailUUID.fulfilled]: (state, action) => {
      state.tillAuth = action.payload.uuid;
    },
    [createAccount.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [createAccount.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [createAccount.fulfilled]: (state, action) => {
      state.accountId = action.payload.accountData?.id;
      state.currencyCode = action.payload.accountData?.currencyCode;
      state.error = null;
      state.loading = false;
      state.loggedIn = true;
      state.username = action.payload.accountData?.username;

      // if the user was using a different language, is it expected to push him to another lanugage (even if he defined it as such during the account creation process)?
      state.language = action.payload.accountData?.languageCode;
      // Same as above
      state.priceFormat = action.payload.accountData?.priceFormat;

      // Hack: `liveSlice` uses `language`, `priceFormat` but has no direct access to this state.
      // Therefore, update them when in redux values changed..
      backdoor.language = state.language; // dependant on the 2 points above ("if the user..")
      backdoor.priceFormat = state.priceFormat; // dependant on the 2 points above ("if the user..")
    },
    [forceLogin.pending]: (state, action) => {
      const language = action.meta?.arg?.language;
      backdoor.language = language;
    },
    [forceLogin.rejected]: (state) => {
      // do nothing
    },
    [forceLogin.fulfilled]: (state, action) => {
      state.accountId = action.payload.accountId;
      state.authToken = action.payload.authToken;
      state.language = action.payload.language;
      state.currencyCode = action.payload.currencyCode;
      state.username = action.payload.username;
      state.loggedIn = true;
    },
  },
  initialState: getInitialState({}),
  name: "auth",
  reducers: {
    setAuthCurrencyCode(state, action) {
      state.currencyCode = action.payload.currencyCode;
    },
    setAuthIFrameQueryParamsProcessed(state, action) {
      state.authIFrameQueryParamsProcessed = true;
    },
    setAuthIsSplitModePreferred(state, action) {
      state.isSplitModePreferred = action.payload.isSplitModePreferred;
    },
    setAuthLanguage: {
      // Hack: `liveSlice` uses `language`, `priceFormat` but has no direct access to this state.
      // Therefore, update them when in redux values changed..
      prepare(payload) {
        backdoor.language = payload.language;

        return { payload };
      },
      reducer(state, action) {
        state.language = action.payload.language;
      },
    },
    setAuthLoginURL(state, action) {
      state.authLoginURL = action.payload.authLoginURL;
    },
    setAuthPriceFormat: {
      // Hack: `liveSlice` uses `language`, `priceFormat` but has no direct access to this state.
      // Therefore, update them when in redux values changed.
      prepare(payload) {
        backdoor.priceFormat = payload.priceFormat;

        return { payload };
      },
      reducer(state, action) {
        state.priceFormat = action.payload.priceFormat;
      },
    },
    setRetailUUID(state, action) {
      state.tillAuth = action.payload.uuid;
    },
    setTimezoneOffset(state, action) {
      state.timezoneOffset = action.payload.timezoneOffset;
    },
  },
});

const { actions, reducer } = authSlice;
export const {
  setAuthCurrencyCode,
  setAuthIFrameQueryParamsProcessed,
  setAuthIsSplitModePreferred,
  setAuthLanguage,
  setAuthLoginURL,
  setAuthPriceFormat,
  setRetailUUID,
  setTimezoneOffset,
} = actions;
export default reducer;
