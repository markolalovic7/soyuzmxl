/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getCmsBrandDetailsCountries,
  getCmsBrandDetailsCurrencies,
  getCmsBrandDetailsLanguages,
  getCmsConfigAccounts,
  getCmsConfigAppearance,
  getCmsConfigAppearanceMobileDashboardPreferences,
  getCmsConfigBetting,
  getCmsConfigBetradarVirtual,
  getCmsConfigBrandDetails,
  getCmsConfigBrandLogos,
  getCmsConfigBrandName,
  getCmsConfigIframeMode,
  getCmsConfigIsLoading,
  getCmsConfigKironVirtual,
  getCmsConfigSelector,
  getCmsConfigSportsBook,
  getCmsLineId,
  getCmsOriginId,
  getCmsSelector,
} from "redux/reselect/cms-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getCmsSelector", () => {
    it("should return `cms` from store", () => {
      expect(
        getCmsSelector({
          cms: {
            lineId: 2,
            originId: 1,
          },
        }),
      ).is.deep.equal({
        lineId: 2,
        originId: 1,
      });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(getCmsSelector({})).is.deep.equal({});
      expect(
        getCmsSelector({
          cms: {},
        }),
      ).is.deep.equal({});
    });
  });
  describe("getCmsConfigSelector", () => {
    it("should return `config` from store", () => {
      expect(
        getCmsConfigSelector({
          cms: {
            config: {
              siteConfigs: "siteConfigs",
            },
            lineId: 2,
            originId: 1,
          },
        }),
      ).is.deep.equal({
        siteConfigs: "siteConfigs",
      });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(getCmsConfigSelector({})).is.undefined;
      expect(
        getCmsConfigSelector({
          cms: {},
        }),
      ).is.undefined;
    });
  });
  describe("getCmsOriginId", () => {
    it("should return `originId` from store", () => {
      expect(
        getCmsOriginId({
          cms: {
            config: {
              siteConfigs: "siteConfigs",
            },
            lineId: 2,
            originId: 1,
          },
        }),
      ).is.equal(1);
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(getCmsOriginId({})).is.undefined;
      expect(
        getCmsOriginId({
          cms: {},
        }),
      ).is.undefined;
    });
  });
  describe("getCmsLineId", () => {
    it("should return `lineId` from store", () => {
      expect(
        getCmsLineId({
          cms: {
            config: {
              siteConfigs: "siteConfigs",
            },
            lineId: 2,
            originId: 1,
          },
        }),
      ).is.equal(2);
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(getCmsLineId({})).is.undefined;
      expect(getCmsLineId({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigIsLoading", () => {
    it("should return `loading` from store", () => {
      expect(
        getCmsConfigIsLoading({
          cms: {
            config: {
              siteConfigs: "siteConfigs",
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.false;
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(getCmsConfigIsLoading({})).is.undefined;
      expect(getCmsConfigIsLoading({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigAccounts", () => {
    it("should return `siteConfig` when type is `ACCOUNTS`", () => {
      expect(
        getCmsConfigAccounts({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }, { configType: "ACCOUNTS" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "ACCOUNTS" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigAccounts({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigAccounts({})).is.undefined;
      expect(getCmsConfigAccounts({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigAppearance", () => {
    it("should return `siteConfig` when type is `APPEARANCE`", () => {
      expect(
        getCmsConfigAppearance({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "APPEARANCE" },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "APPEARANCE" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigAppearance({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigAppearance({})).is.undefined;
      expect(getCmsConfigAppearance({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigAppearanceMobileDashboardPreferences", () => {
    it("should return `mobileDashboardPreferences` when type is `APPEARANCE`", () => {
      expect(
        getCmsConfigAppearanceMobileDashboardPreferences({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                {
                  configType: "APPEARANCE",
                  data: { mobileDashboardPreferences: [{ id: "mobileDashboardPreferences" }] },
                },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal([{ id: "mobileDashboardPreferences" }]);
    });
    it("should return `empty array` when `cms` is empty", () => {
      expect(
        getCmsConfigAppearanceMobileDashboardPreferences({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                {
                  configType: "APPEARANCE",
                  data: undefined,
                },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal([]);
      expect(getCmsConfigAppearanceMobileDashboardPreferences({})).is.deep.equal([]);
      expect(getCmsConfigAppearanceMobileDashboardPreferences({ cms: {} })).is.deep.equal([]);
    });
  });
  describe("getCmsConfigBrandDetails", () => {
    it("should return `siteConfig` when type is `BRAND_DETAILS`", () => {
      expect(
        getCmsConfigBrandDetails({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BRAND_DETAILS" },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "BRAND_DETAILS" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigBrandDetails({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigBrandDetails({})).is.undefined;
      expect(getCmsConfigBrandDetails({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigBetting", () => {
    it("should return `siteConfig` when type is `BETTING`", () => {
      expect(
        getCmsConfigBetting({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }, { configType: "BETTING" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "BETTING" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigBetting({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigBetting({})).is.undefined;
      expect(getCmsConfigBetting({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigSportsBook", () => {
    it("should return `siteConfig` when type is `SPORTSBOOK`", () => {
      expect(
        getCmsConfigSportsBook({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "SPORTSBOOK" },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "SPORTSBOOK" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigSportsBook({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigSportsBook({})).is.undefined;
      expect(getCmsConfigSportsBook({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigBetradarVirtual", () => {
    it("should return `siteConfig` when type is `BETRADAR_VIRTUAL`", () => {
      expect(
        getCmsConfigBetradarVirtual({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BETRADAR_VIRTUAL" },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "BETRADAR_VIRTUAL" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigBetradarVirtual({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigBetradarVirtual({})).is.undefined;
      expect(getCmsConfigBetradarVirtual({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigKironVirtual", () => {
    it("should return `siteConfig` when type is `KIRON_VIRTUAL`", () => {
      expect(
        getCmsConfigKironVirtual({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "KIRON_VIRTUAL" },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ configType: "KIRON_VIRTUAL" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigKironVirtual({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigKironVirtual({})).is.undefined;
      expect(getCmsConfigKironVirtual({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigBrandLogos", () => {
    it("should return `data` when type is `BRAND_LOGOS`", () => {
      expect(
        getCmsConfigBrandLogos({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BRAND_LOGOS", data: { foo: "bar" } },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({ foo: "bar" });
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigBrandLogos({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal({});
      expect(getCmsConfigBrandLogos({})).is.deep.equal({});
      expect(getCmsConfigBrandLogos({ cms: {} })).is.deep.equal({});
    });
  });
  describe("getCmsConfigBrandName", () => {
    it("should return `data` when type is `BRAND_DETAILS`", () => {
      expect(
        getCmsConfigBrandName({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BRAND_DETAILS", data: { brandName: "brandName", foo: "bar" } },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.equal("brandName");
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigBrandName({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigBrandName({})).is.undefined;
      expect(getCmsConfigBrandName({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsConfigIframeMode", () => {
    it("should return true if iframe flag is enabled in `BRAND_DETAILS`", () => {
      expect(
        getCmsConfigIframeMode({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BRAND_DETAILS", data: { iframeMode: true } },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.equal(true);
    });
    it("should return false if iframe flag is disabled in `BRAND_DETAILS`", () => {
      expect(
        getCmsConfigIframeMode({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                { configType: "BRAND_DETAILS", data: { iframeMode: false } },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.equal(false);
    });
    it("should return `undefined` when `cms` is empty", () => {
      expect(
        getCmsConfigIframeMode({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.undefined;
      expect(getCmsConfigIframeMode({})).is.undefined;
      expect(getCmsConfigIframeMode({ cms: {} })).is.undefined;
    });
  });
  describe("getCmsBrandDetailsCountries", () => {
    it("should return `countries` from `BRAND_DETAILS` site config", () => {
      expect(
        getCmsBrandDetailsCountries({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                {
                  configType: "BRAND_DETAILS",
                  data: {
                    countries: ["country-1"],
                  },
                },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
          country: {
            countries: [
              {
                description: "description-1",
                isoCode2: "country-1",
              },
              {
                description: "description-2",
                isoCode2: "country-2",
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          key: "country-1",
          label: "description-1",
          value: "country-1",
        },
      ]);
    });
    it("should return `empty array` when `cms` is empty", () => {
      expect(
        getCmsBrandDetailsCountries({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal([]);
      expect(getCmsBrandDetailsCountries({})).is.deep.equal([]);
      expect(getCmsBrandDetailsCountries({ cms: {} })).is.deep.equal([]);
    });
  });
  describe("getCmsBrandDetailsCurrencies", () => {
    it("should return `currencies` from `BRAND_DETAILS` site config", () => {
      expect(
        getCmsBrandDetailsCurrencies({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                {
                  configType: "BRAND_DETAILS",
                  data: {
                    currencies: ["currency-1"],
                  },
                },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
          currency: {
            currencies: [
              {
                description: "description-1",
                isoCode: "currency-1",
              },
              {
                description: "description-2",
                isoCode: "currency-2",
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          key: "currency-1",
          label: "description-1",
          value: "currency-1",
        },
      ]);
    });
    it("should return `empty array` when `cms` is empty", () => {
      expect(
        getCmsBrandDetailsCurrencies({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal([]);
      expect(getCmsBrandDetailsCurrencies({})).is.deep.equal([]);
      expect(getCmsBrandDetailsCurrencies({ cms: {} })).is.deep.equal([]);
    });
  });
  describe("getCmsBrandDetailsLanguages", () => {
    it("should return `languages` from `BRAND_DETAILS` site config", () => {
      expect(
        getCmsBrandDetailsLanguages({
          cms: {
            config: {
              siteConfigs: [
                { configType: "configType-1" },
                { configType: "configType-2" },
                {
                  configType: "BRAND_DETAILS",
                  data: {
                    languages: ["language-1"],
                  },
                },
              ],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
          language: {
            languages: [
              {
                description: "description-1",
                isoCode2: "language-1",
              },
              {
                description: "description-2",
                isoCode2: "language-2",
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          key: "language-1",
          label: "description-1",
          value: "language-1",
        },
      ]);
    });
    it("should return `empty array` when `cms` is empty", () => {
      expect(
        getCmsBrandDetailsLanguages({
          cms: {
            config: {
              siteConfigs: [{ configType: "configType-1" }, { configType: "configType-2" }],
            },
            lineId: 2,
            loading: false,
            originId: 1,
          },
        }),
      ).is.deep.equal([]);
      expect(getCmsBrandDetailsLanguages({})).is.deep.equal([]);
      expect(getCmsBrandDetailsLanguages({ cms: {} })).is.deep.equal([]);
    });
  });
});
