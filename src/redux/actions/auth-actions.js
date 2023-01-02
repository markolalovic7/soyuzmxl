import { createAction } from "@reduxjs/toolkit";

export const AUTH_USER_UNAUTHORIZED = "auth/unauthorized";
export const AUTH_SET_TOKEN = "auth/setAuthToken";
export const AUTH_SET_MOBILE_VIEW = "auth/setAuthMobileView";
export const AUTH_SET_MOBILE_THEME = "auth/setAuthMobileTheme";
export const AUTH_SET_DESKTOP_VIEW = "auth/setAuthDesktopView";
export const AUTH_SET_DESKTOP_THEME = "auth/setAuthDesktopTheme";

export const logout = createAction(AUTH_USER_UNAUTHORIZED);

export const setAuthToken = createAction(AUTH_SET_TOKEN);

export const setAuthMobileView = createAction(AUTH_SET_MOBILE_VIEW);

export const setAuthMobileTheme = createAction(AUTH_SET_MOBILE_THEME);

export const setAuthDesktopView = createAction(AUTH_SET_DESKTOP_VIEW);

export const setAuthDesktopTheme = createAction(AUTH_SET_DESKTOP_THEME);
