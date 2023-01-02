/* eslint-disable no-unused-expressions */
import path from "path";

import {expect} from "chai";
import {describe, it} from "mocha";
import {
  getAuthAccountId,
  getAuthCurrencyCode,
  getAuthDesktopView,
  getAuthError,
  getAuthIsIframe,
  getAuthLanguage,
  getAuthLoading,
  getAuthLoggedIn,
  getAuthMobileTheme,
  getAuthMobileView,
  getAuthPriceFormat,
  getAuthRememberedUsername,
  getAuthSelector,
  getAuthTimezoneOffset,
  getAuthToken,
  getAuthUsername,
} from "redux/reselect/auth-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getAuthSelector", () => {
    it("should return `auth` from store", () => {
      expect(
        getAuthSelector({
          auth: {
            accountId: 42,
          },
        }),
      ).is.deep.equal({
        accountId: 42,
      });
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthAccountId({})).is.undefined;
    });
  });
  describe("getAuthAccountId", () => {
    it("should return `accountId` from store", () => {
      expect(
        getAuthAccountId({
          auth: {
            accountId: 42,
          },
        }),
      ).is.deep.equal(42);
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthAccountId({ auth: {} })).is.undefined;
      expect(getAuthAccountId({})).is.undefined;
    });
  });
  describe("getAuthCurrencyCode", () => {
    it("should return `currencyCode` from store", () => {
      expect(
        getAuthCurrencyCode({
          auth: {
            currencyCode: "USD",
          },
        }),
      ).is.deep.equal("USD");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthCurrencyCode({ auth: {} })).is.undefined;
      expect(getAuthCurrencyCode({})).is.undefined;
    });
  });
  describe("getAuthDesktopView", () => {
    it("should return `desktopView` from store", () => {
      expect(
        getAuthDesktopView({
          auth: {
            desktopView: "desktopView",
          },
        }),
      ).is.equal("desktopView");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthDesktopView({ auth: {} })).is.undefined;
      expect(getAuthDesktopView({})).is.undefined;
    });
  });
  describe("getAuthError", () => {
    it("should return `error` from store", () => {
      expect(
        getAuthError({
          auth: {
            error: "Something went wrong",
          },
        }),
      ).is.deep.equal("Something went wrong");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthError({ auth: {} })).is.undefined;
      expect(getAuthError({})).is.undefined;
    });
  });
  describe("getAuthLanguage", () => {
    it("should return `language` from store", () => {
      expect(
        getAuthLanguage({
          auth: {
            language: "en",
          },
        }),
      ).is.deep.equal("en");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthLanguage({ auth: {} })).is.undefined;
      expect(getAuthLanguage({})).is.undefined;
    });
  });
  describe("getAuthLoading", () => {
    it("should return `loading` from store", () => {
      expect(
        getAuthLoading({
          auth: {
            loading: true,
          },
        }),
      ).is.true;
      expect(
        getAuthLoading({
          auth: {
            loading: false,
          },
        }),
      ).is.false;
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthLoading({ auth: {} })).is.undefined;
      expect(getAuthLoading({})).is.undefined;
    });
  });
  describe("getAuthLoggedIn", () => {
    it("should return `loggedIn` from store", () => {
      expect(
        getAuthLoggedIn({
          auth: {
            loggedIn: false,
          },
        }),
      ).is.false;
      expect(
        getAuthLoggedIn({
          auth: {
            loggedIn: true,
          },
        }),
      ).is.true;
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthLoggedIn({ auth: {} })).is.false;
      expect(getAuthLoggedIn({})).is.false;
    });
  });
  describe("getAuthMobileView", () => {
    it("should return `mobileView` from store", () => {
      expect(
        getAuthMobileView({
          auth: {
            mobileView: "mobileView",
          },
        }),
      ).is.equal("mobileView");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthMobileView({ auth: {} })).is.undefined;
      expect(getAuthMobileView({})).is.undefined;
    });
  });
  describe("getAuthMobileTheme", () => {
    it("should return `mobileTheme` from store", () => {
      expect(
        getAuthMobileTheme({
          auth: {
            mobileTheme: "mobileTheme",
          },
        }),
      ).is.equal("mobileTheme");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthMobileTheme({ auth: {} })).is.undefined;
      expect(getAuthMobileTheme({})).is.undefined;
    });
  });
  describe("getAuthPriceFormat", () => {
    it("should return `priceFormat` from store", () => {
      expect(
        getAuthPriceFormat({
          auth: {
            priceFormat: "EURO",
          },
        }),
      ).is.deep.equal("EURO");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthPriceFormat({ auth: {} })).is.undefined;
      expect(getAuthPriceFormat({})).is.undefined;
    });
  });
  describe("getAuthRememberedUsername", () => {
    it("should return `rememberedUsername` from store", () => {
      expect(
        getAuthRememberedUsername({
          auth: {
            rememberedUsername: "username",
          },
        }),
      ).is.deep.equal("username");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthRememberedUsername({ auth: {} })).is.undefined;
      expect(getAuthRememberedUsername({})).is.undefined;
    });
  });
  describe("getAuthTimezoneOffset", () => {
    it("should return `timezoneOffset` from store", () => {
      expect(
        getAuthTimezoneOffset({
          auth: {
            timezoneOffset: "-2",
          },
        }),
      ).is.deep.equal("-2");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthTimezoneOffset({ auth: {} })).is.undefined;
      expect(getAuthTimezoneOffset({})).is.undefined;
    });
  });
  describe("getAuthToken", () => {
    it("should return `authToken` from store", () => {
      expect(
        getAuthToken({
          auth: {
            authToken: "token",
          },
        }),
      ).is.deep.equal("token");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthToken({ auth: {} })).is.undefined;
      expect(getAuthToken({})).is.undefined;
    });
  });
  describe("getAuthUsername", () => {
    it("should return `username` from store", () => {
      expect(
        getAuthUsername({
          auth: {
            username: "username",
          },
        }),
      ).is.deep.equal("username");
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthUsername({ auth: {} })).is.undefined;
      expect(getAuthUsername({})).is.undefined;
    });
  });
  describe("getAuthIsIframe", () => {
    it("should return `isIframe` from store", () => {
      expect(
        getAuthIsIframe({
          auth: {
            isIframe: true,
          },
        }),
      ).is.deep.equal(true);
      expect(
        getAuthIsIframe({
          auth: {
            isIframe: false,
          },
        }),
      ).is.deep.equal(false);
    });
    it("should return `undefined` when `auth` is empty", () => {
      expect(getAuthIsIframe({ auth: {} })).is.undefined;
      expect(getAuthIsIframe({})).is.undefined;
    });
  });
});
