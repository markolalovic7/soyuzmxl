import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import {
  CMS_CONFIG_TYPE_APPEARANCE,
  CMS_CONFIG_TYPE_BETTING,
  CMS_CONFIG_TYPE_BRAND_DETAILS,
} from "constants/cms-config-types";
import { AUTH_SET_MOBILE_VIEW, AUTH_SET_TOKEN, setAuthMobileTheme } from "redux/actions/auth-actions";
import { createAccount } from "redux/slices/accountSlice";
import authReducer, {
  forceLogin,
  getInitialState,
  login,
  setAuthLanguage,
  setAuthPriceFormat,
  setTimezoneOffset,
} from "redux/slices/authSlice";
import { getCmsConfig } from "redux/slices/cmsSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(
      getInitialState({
        accountId: "accountId",
        authLoginURL: undefined,
        authToken: "authToken",
        currencyCode: "currencyCode",
        desktopTheme: "desktopTheme",
        desktopView: "desktopView",
        language: "language",
        loggedIn: "loggedIn",
        mobileTheme: "mobileTheme",
        mobileView: "mobileView",
        priceFormat: "priceFormat",
        rememberedUsername: "rememberedUsername",
        timezoneOffset: "timezoneOffset",
        username: "username",
      }),
    ).to.be.deep.equal({
      accountId: "accountId",
      authIFrameQueryParamsProcessed: false,
      authLoginURL: undefined,
      authToken: "authToken",
      currencyCode: "currencyCode",
      desktopTheme: "desktopTheme",
      desktopView: "desktopView",
      error: null,
      isIframe: true,
      isSplitModePreferred: false,
      language: "language",
      loading: false,
      loggedIn: "loggedIn",
      mobileTheme: "mobileTheme",
      mobileView: "mobileView",
      priceFormat: "priceFormat",
      rememberedUsername: "rememberedUsername",
      tillAuth: null,
      timezoneOffset: "timezoneOffset",
      username: "username",
    });
  });
  it("should update state when action type is `getReferrals.pending`", () => {
    expect(
      authReducer(
        {},
        {
          payload: {
            mobileView: "mobileView",
          },
          type: AUTH_SET_MOBILE_VIEW,
        },
      ),
    ).to.be.deep.equal({
      mobileView: "mobileView",
    });
  });
  it("should update state when action type is `setAuthToken.fulfilled`", () => {
    expect(
      authReducer(
        {
          loggedIn: false,
        },
        {
          payload: {
            authToken: "authToken",
          },
          type: AUTH_SET_TOKEN,
        },
      ),
    ).to.be.deep.equal({
      loggedIn: false,
    });
    expect(
      authReducer(
        {
          accountId: 123,
          loggedIn: true,
        },
        {
          payload: {
            authToken: "authToken",
          },
          type: AUTH_SET_TOKEN,
        },
      ),
    ).to.be.deep.equal({
      accountId: 123,
      authToken: "authToken",
      loggedIn: true,
    });
  });
  it("should update empty state when action type is `getCmsConfig.fulfilled`", () => {
    expect(
      authReducer(
        {},
        getCmsConfig.fulfilled({
          config: {
            siteConfigs: [
              {
                configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                data: {
                  defaultCurrency: "defaultCurrency",
                  defaultLanguage: "defaultLanguage",
                },
              },
              {
                configType: CMS_CONFIG_TYPE_BETTING,
                data: {
                  defaultPriceFormat: "defaultPriceFormat",
                },
              },
              {
                configType: CMS_CONFIG_TYPE_APPEARANCE,
                data: {
                  desktopViews: [
                    {
                      defaultView: true,
                      desktopView: "desktopView",
                    },
                  ],
                  mobileViews: [
                    {
                      defaultView: true,
                      mobileView: "mobileView",
                    },
                  ],
                },
              },
            ],
          },
        }),
      ),
    ).to.be.deep.equal({
      currencyCode: "defaultCurrency",
      desktopView: "desktopView",
      language: "defaultlanguage",
      mobileTheme: "KOREAN_THEME",
      mobileView: "mobileView",
      priceFormat: "defaultPriceFormat",
    });
  });
  it("should update state when action type is `getCmsConfig.fulfilled`", () => {
    expect(
      authReducer(
        {
          currencyCode: "currencyCode",
          language: "language",
          priceFormat: "priceFormat",
        },
        getCmsConfig.fulfilled({
          config: {
            siteConfigs: [
              {
                configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                data: {
                  defaultCurrency: "defaultCurrency",
                  defaultLanguage: "defaultLanguage",
                },
              },
              {
                configType: CMS_CONFIG_TYPE_BETTING,
                data: {
                  defaultPriceFormat: "defaultPriceFormat",
                },
              },
              {
                configType: CMS_CONFIG_TYPE_APPEARANCE,
                data: {
                  desktopViews: [
                    {
                      defaultView: true,
                      desktopView: "desktopView",
                    },
                  ],
                  mobileViews: [
                    {
                      defaultView: true,
                      mobileView: "mobileView",
                    },
                  ],
                },
              },
            ],
          },
        }),
      ),
    ).to.be.deep.equal({
      currencyCode: "currencyCode",
      desktopView: "desktopView",
      language: "language",
      mobileTheme: "KOREAN_THEME",
      mobileView: "mobileView",
      priceFormat: "priceFormat",
    });
  });
  it("should update state when action type is `login.pending`", () => {
    expect(authReducer({}, login.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `login.rejected`", () => {
    expect(authReducer({}, login.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
      loggedIn: false,
    });
  });
  it("should update state when action type is `login.fulfilled`", () => {
    expect(
      authReducer(
        {
          accountId: "accountId-1",
          authToken: "authToken-1",
          currencyCode: "currencyCode-1",
          error: "error-1",
          loading: true,
          loggedIn: "loggedIn-1",
          rememberedUsername: "rememberedUsername-1",
          username: "username-1",
        },
        login.fulfilled({
          accountId: "accountId",
          authToken: "authToken",
          currencyCode: "currencyCode",
          rememberedUsername: true,
          username: "username",
        }),
      ),
    ).to.be.deep.equal({
      accountId: "accountId",
      authToken: "authToken",
      currencyCode: "currencyCode",
      error: null,
      loading: false,
      loggedIn: true,
      rememberedUsername: true,
      username: "username",
    });
  });
  it("should update state when action type is `createAccount.pending`", () => {
    expect(authReducer({}, createAccount.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `createAccount.rejected`", () => {
    expect(authReducer({}, createAccount.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `createAccount.fulfilled`", () => {
    expect(
      authReducer(
        {
          accountId: "accountId-1",
          authToken: "authToken-1",
          currencyCode: "currencyCode-1",
          error: "error-1",
          loading: true,
          loggedIn: "loggedIn-1",
          rememberedUsername: "rememberedUsername-1",
          username: "username-1",
        },
        createAccount.fulfilled({
          accountData: {
            currencyCode: "currencyCode",
            id: "id",
            languageCode: "languageCode",
            priceFormat: "priceFormat",
            username: "username",
          },
        }),
      ),
    ).to.be.deep.equal({
      accountId: "id",
      authToken: "authToken-1",
      currencyCode: "currencyCode",
      error: null,
      language: "languageCode",
      loading: false,
      loggedIn: true,
      priceFormat: "priceFormat",
      rememberedUsername: "rememberedUsername-1",
      username: "username",
    });
  });
  it("should update state when action is setAuthMobileTheme", () => {
    expect(authReducer({}, setAuthMobileTheme({ mobileTheme: "mobileTheme" }))).to.be.deep.equal({
      mobileTheme: "mobileTheme",
    });
  });
  it("should update state when action is setAuthLanguage", () => {
    expect(authReducer({}, setAuthLanguage({ language: "lang" }))).to.be.deep.equal({
      language: "lang",
    });
    expect(authReducer({ language: "language-1" }, setAuthLanguage({ language: "lang" }))).to.be.deep.equal({
      language: "lang",
    });
  });
  it("should update state when action is setAuthPriceFormat", () => {
    expect(authReducer({}, setAuthPriceFormat({ priceFormat: "priceFormat" }))).to.be.deep.equal({
      priceFormat: "priceFormat",
    });
    expect(
      authReducer({ priceFormat: "priceFormat-1" }, setAuthPriceFormat({ priceFormat: "priceFormat" })),
    ).to.be.deep.equal({
      priceFormat: "priceFormat",
    });
  });
  it("should update state when action is setAuthPriceFormat", () => {
    expect(authReducer({}, setTimezoneOffset({ timezoneOffset: "timezoneOffset" }))).to.be.deep.equal({
      timezoneOffset: "timezoneOffset",
    });
    expect(
      authReducer({ timezoneOffset: "timezoneOffset-1" }, setTimezoneOffset({ timezoneOffset: "timezoneOffset" })),
    ).to.be.deep.equal({
      timezoneOffset: "timezoneOffset",
    });
  });
  it("should update state when action is forceLogin", () => {
    expect(
      authReducer({}, forceLogin.fulfilled({ accountId: "accountId", authToken: "authToken", language: "language" })),
    ).to.be.deep.equal({
      accountId: "accountId",
      authToken: "authToken",
      currencyCode: undefined,
      language: "language",
      loggedIn: true,
      username: undefined,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(authReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
