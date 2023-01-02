import { createSelector } from "@reduxjs/toolkit";

export const getAuthSelector = createSelector(
  (state) => state.auth,
  (auth) => auth || {},
);

export const getAuthAccountId = createSelector(
  (state) => state.auth?.accountId,
  (accountId) => accountId,
);

export const getAuthCurrencyCode = createSelector(
  (state) => state.auth?.currencyCode,
  (currencyCode) => currencyCode,
);

export const getAuthError = createSelector(
  (state) => state.auth?.error,
  (error) => error,
);

export const getAuthDesktopView = createSelector(
  (state) => state.auth?.desktopView,
  // View based on CMS data...  (but we can override via env variables for dev purposes).
  (desktopView) => process.env.REACT_APP_DESKTOP_TYPE || desktopView,
);

export const getAuthLanguage = createSelector(
  (state) => state.auth?.language,
  (language) => language,
);

export const getAuthLoading = createSelector(
  (state) => state.auth?.loading,
  (loading) => loading,
);

export const getAuthLoggedIn = createSelector(
  (state) => !!state.auth?.loggedIn,
  (loggedIn) => loggedIn,
);

export const getAuthMobileView = createSelector(
  (state) => state.auth?.mobileView,
  // View based on CMS data...  (but we can override via env variables for dev purposes).
  (mobileView) => process.env.REACT_APP_MOBILE_TYPE || mobileView,
);

export const getAuthMobileTheme = createSelector(
  (state) => state.auth?.mobileTheme,
  (mobileTheme) => mobileTheme,
);

export const getAuthPriceFormat = createSelector(
  (state) => state.auth?.priceFormat,
  (priceFormat) => priceFormat,
);

export const getAuthRememberedUsername = createSelector(
  (state) => state.auth?.rememberedUsername,
  (rememberedUsername) => rememberedUsername,
);

export const getAuthTimezoneOffset = createSelector(
  (state) => state.auth?.timezoneOffset,
  (timezoneOffset) => timezoneOffset,
);

export const getAuthToken = createSelector(
  (state) => state.auth?.authToken,
  (authToken) => authToken,
);

export const getAuthUsername = createSelector(
  (state) => state.auth?.username,
  (username) => username,
);

export const getAuthIsIframe = createSelector(
  (state) => state.auth?.isIframe,
  (isIframe) => isIframe,
);

export const getAuthLoginURL = createSelector(
  (state) => state.auth?.authLoginURL,
  (authLoginURL) => authLoginURL,
);

export const getAuthIsSplitModePreferred = createSelector(
  (state) => state.auth?.isSplitModePreferred,
  (getAuthIsSplitModePreferred) => getAuthIsSplitModePreferred,
);

export const getAuthTill = createSelector(
  (state) => state.auth?.tillAuth,
  (tillAuth) => tillAuth,
);

export const getAuthIFrameQueryParamsProcessed = createSelector(
  (state) => !!state.auth?.authIFrameQueryParamsProcessed,
  (loggedIn) => loggedIn,
);
