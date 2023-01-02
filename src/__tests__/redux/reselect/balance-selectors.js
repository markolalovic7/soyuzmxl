/* eslint-disable no-unused-expressions */
import path from "path";

import {expect} from "chai";
import {CMS_CONFIG_TYPE_BRAND_DETAILS} from "constants/cms-config-types";
import {describe, it} from "mocha";

import {getBalance} from "../../../redux/reselect/balance-selector";

describe(path.relative(process.cwd(), __filename), () => {
    describe("getBalance", () => {
        it("should return `undefined` when `auth` is empty", () => {
            expect(getBalance({auth: {}})).is.undefined;
        });
        it("should return `undefined` when user is not logged in", () => {
            expect(getBalance({auth: {loggedIn: false}})).is.undefined;
    });
    it("should return `undefined` when cms is empty", () => {
      expect(
        getBalance({
          auth: {
            loggedIn: true,
          },
          cms: {},
        }),
      ).is.undefined;
    });
    it("should return `undefined` when cms brand details is empty", () => {
      expect(
        getBalance({
          auth: {
            loggedIn: true,
          },
          cms: {
            config: {
              siteConfigs: [{ configType: CMS_CONFIG_TYPE_BRAND_DETAILS }],
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `singleWalletMode` is `undefined`", () => {
      expect(
        getBalance({
          auth: {
            loggedIn: true,
          },
          cms: {
            config: {
              siteConfigs: [
                {
                  configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                  data: {
                    singleWalletMode: undefined,
                  },
                },
              ],
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `singleWalletBalance` is `undefined`", () => {
      expect(
        getBalance({
          auth: {
            loggedIn: true,
          },
          balance: {
            balance: undefined,
            singleWalletBalance: undefined,
          },
          cms: {
            config: {
              siteConfigs: [
                {
                  configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                  data: {
                    singleWalletMode: true,
                  },
                },
              ],
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `singleWalletBalance`", () => {
      expect(
        getBalance({
          auth: {
            accountId: 1234,
            loggedIn: true,
          },
          balance: {
            balance: {},
            singleWalletBalance: "singleWalletBalance",
          },
          cms: {
            config: {
              siteConfigs: [
                {
                  configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                  data: {
                    singleWalletMode: true,
                  },
                },
              ],
            },
          },
        }),
      ).is.be.equal("singleWalletBalance");
    });
    it("should return `balance`", () => {
      expect(
        getBalance({
          auth: {
            accountId: 1234,
            loggedIn: true,
          },
          balance: {
            balance: "balance",
            singleWalletBalance: undefined,
          },
          cms: {
            config: {
              siteConfigs: [
                {
                  configType: CMS_CONFIG_TYPE_BRAND_DETAILS,
                  data: {
                    singleWalletMode: false,
                  },
                },
              ],
            },
          },
        }),
      ).is.equal("balance");
    });
  });
});
