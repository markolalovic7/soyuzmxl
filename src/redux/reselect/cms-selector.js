import { createSelector } from "@reduxjs/toolkit";
import {
  CMS_CONFIG_TYPE_ACCOUNTS,
  CMS_CONFIG_TYPE_APPEARANCE,
  CMS_CONFIG_TYPE_BETRADAR_VIRTUAL,
  CMS_CONFIG_TYPE_BETTING,
  CMS_CONFIG_TYPE_BRAND_DETAILS,
  CMS_CONFIG_TYPE_BRAND_LOGOS,
  CMS_CONFIG_TYPE_KIRON_VIRTUAL,
  CMS_CONFIG_TYPE_SPORTS_BOOK,
  CMS_CONFIG_TYPE_RESULTS,
} from "constants/cms-config-types";

export const getCmsSelector = createSelector(
  (state) => state.cms,
  (cms) => cms || {},
);

export const getCmsConfigSelector = createSelector(
  (state) => state.cms?.config,
  (config) => config,
);

export const getCmsOriginId = createSelector(
  (state) => state.cms?.originId,
  (originId) => originId,
);

export const getCmsLineId = createSelector(
  (state) => state.cms?.lineId,
  (lineId) => lineId,
);

export const getCmsConfigIsLoading = createSelector(
  (state) => state.cms?.loading,
  (loading) => loading,
);

const getCmsConfigByType = (type) =>
  createSelector(
    (state) => state.cms?.config?.siteConfigs,
    (siteConfigs) => siteConfigs?.find(({ configType }) => configType === type),
  );

export const getCmsConfigAccounts = getCmsConfigByType(CMS_CONFIG_TYPE_ACCOUNTS);

export const getCmsConfigAppearance = getCmsConfigByType(CMS_CONFIG_TYPE_APPEARANCE);

export const getCmsConfigBetradarVirtual = getCmsConfigByType(CMS_CONFIG_TYPE_BETRADAR_VIRTUAL);

export const getCmsConfigBetting = getCmsConfigByType(CMS_CONFIG_TYPE_BETTING);

export const getCmsConfigBrandDetails = getCmsConfigByType(CMS_CONFIG_TYPE_BRAND_DETAILS);

export const getCmsConfigKironVirtual = getCmsConfigByType(CMS_CONFIG_TYPE_KIRON_VIRTUAL);

export const getCmsConfigResults = getCmsConfigByType(CMS_CONFIG_TYPE_RESULTS);

export const getCmsConfigSportsBook = getCmsConfigByType(CMS_CONFIG_TYPE_SPORTS_BOOK);

export const getCmsConfigBrandLogos = createSelector(
  getCmsConfigByType(CMS_CONFIG_TYPE_BRAND_LOGOS),
  (siteConfig) => siteConfig?.data || {},
);

export const getCmsConfigBrandName = createSelector(
  getCmsConfigBrandDetails,
  (brandDetails) => brandDetails?.data?.brandName,
);

export const getCmsConfigIframeMode = createSelector(
  getCmsConfigBrandDetails,
  (brandDetails) => brandDetails?.data?.iframeMode,
);

export const getCmsConfigSingleWalletMode = createSelector(
  getCmsConfigBrandDetails,
  (brandDetails) => brandDetails?.data?.singleWalletMode,
);

export const getCmsBrandDetailsCountries = createSelector(
  getCmsConfigBrandDetails,
  (state) => state.country?.countries,
  (configBrandDetails, countriesList) => {
    if (!configBrandDetails || !countriesList) {
      return [];
    }
    const {
      data: { countries },
    } = configBrandDetails;
    if (!countries) {
      return [];
    }

    return countries.reduce((acc, country) => {
      const countryItem = countriesList.find(({ isoCode2 }) => isoCode2 === country);

      return countryItem
        ? [
            ...acc,
            {
              key: country,
              label: countryItem.description,
              value: country,
            },
          ]
        : acc;
    }, []);
  },
);

export const getCmsBrandDetailsCurrencies = createSelector(
  getCmsConfigBrandDetails,
  (state) => state.currency?.currencies,
  (configBrandDetails, currenciesList) => {
    if (!configBrandDetails || !currenciesList) {
      return [];
    }
    const {
      data: { currencies },
    } = configBrandDetails;
    if (!currencies) {
      return [];
    }

    return currencies.reduce((acc, currency) => {
      const currencyItem = currenciesList.find(({ isoCode }) => isoCode === currency);

      return currencyItem
        ? [
            ...acc,
            {
              key: currency,
              label: currencyItem.description,
              value: currency,
            },
          ]
        : acc;
    }, []);
  },
);

export const getCmsBrandDetailsLanguages = createSelector(
  getCmsConfigBrandDetails,
  (state) => state.language?.languages,
  (configBrandDetails, languagesList) => {
    if (!configBrandDetails || !languagesList) {
      return [];
    }
    const {
      data: { languages },
    } = configBrandDetails;
    if (!languages) {
      return [];
    }

    return languages.reduce((acc, language) => {
      const languageItem = languagesList.find(({ isoCode2 }) => isoCode2 === language);

      return languageItem
        ? [
            ...acc,
            {
              key: language,
              label: languageItem.description,
              value: language,
            },
          ]
        : acc;
    }, []);
  },
);

export const getCmsConfigAppearanceMobileDashboardPreferences = createSelector(
  getCmsConfigByType(CMS_CONFIG_TYPE_APPEARANCE),
  (cmsConfig) => {
    if (cmsConfig?.data?.mobileDashboardPreferences) {
      return [...cmsConfig?.data?.mobileDashboardPreferences].sort((a, b) => {
        let aValue;
        let bValue;
        switch (a) {
          case "FEATURED":
            aValue = 0;
            break;
          case "NEXT":
            aValue = 100;
            break;
          case "LIVE":
            aValue = 1000;
            break;
          default:
            aValue = 10000;
            break;
        }
        switch (b) {
          case "FEATURED":
            bValue = 0;
            break;
          case "NEXT":
            bValue = 100;
            break;
          case "LIVE":
            bValue = 1000;
            break;
          default:
            bValue = 10000;
            break;
        }

        return aValue - bValue;
      });
    }

    return [];
  },
);

export const getCmsConfigKironVirtualVideoByFeedCode = createSelector(
  getCmsConfigKironVirtual,
  (_, feedCode) => feedCode,
  (config, feedCode) => {
    if (!config) {
      return undefined;
    }
    const {
      data: { videoURLs },
    } = config || { data: {} };

    return videoURLs[feedCode];
  },
);

export const getCmsConfigBettingStakeLimits = createSelector(getCmsConfigBetting, (config) => {
  if (!config?.data?.stakeLimits) {
    return undefined;
  }

  return config.data.stakeLimits;
});

export const getCmsConfigBettingSingleStakeLimits = createSelector(getCmsConfigBettingStakeLimits, (limits) => {
  if (!limits?.singles) {
    return undefined;
  }

  return limits.singles;
});

export const getCmsConfigBettingMultipleStakeLimits = createSelector(getCmsConfigBettingStakeLimits, (limits) => {
  if (!limits?.accumulators) {
    return undefined;
  }

  return limits.accumulators;
});

export const getCmsConfigBettingSpecialStakeLimits = createSelector(getCmsConfigBettingStakeLimits, (limits) => {
  if (!limits?.specials) {
    return undefined;
  }

  return limits.specials;
});

export const isCmsConfigResultEnabled = createSelector(getCmsConfigResults, (resultDetails) => resultDetails?.data?.on);

export const isCmsConfigResultTypeNative = createSelector(
  getCmsConfigResults,
  (resultDetails) => resultDetails?.data?.type === "NATIVE",
);

export const isCmsConfigResultTypeBetradar = createSelector(
  getCmsConfigResults,
  (resultDetails) => resultDetails?.data?.type === "BETRADAR",
);

export const getCmsConfigResultBetradarUrl = createSelector(
  getCmsConfigResults,
  (resultDetails) => resultDetails?.data?.url,
);
