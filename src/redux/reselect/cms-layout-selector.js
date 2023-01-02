import { createSelector } from "@reduxjs/toolkit";
import {
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_ASIAN,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_CITY,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_COMPACT,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_CONTINENTAL,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_EUROPEAN,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_OB,
  CMS_LAYOUT_VIEW_TYPE_DESKTOP_SLIM,
  CMS_LAYOUT_VIEW_TYPE_MOBILE_ASIAN,
  CMS_LAYOUT_VIEW_TYPE_MOBILE_CITY,
  CMS_LAYOUT_VIEW_TYPE_MOBILE_EZ,
  CMS_LAYOUT_VIEW_TYPE_MOBILE_SLIM,
  CMS_LAYOUT_VIEW_TYPE_MOBILE_VANILLA,
} from "constants/cms-layout-view-types";
import { isNotEmpty } from "utils/lodash";
import { getAuthMobileView } from "./auth-selector";
import { APPLICATION_TYPE_MOBILE_ASIAN, APPLICATION_TYPE_MOBILE_VANILLA } from "../../constants/application-types";

// Get `CMS` config from store.
export const getCmsLayout = createSelector(
  (state) => state.cms?.config,
  (config) => config?.layouts || {},
);

// Get `CMS` layout by type of the application.
function getCmsLayoutByLayoutViewType(type) {
  return (layouts) => (isNotEmpty(layouts) ? layouts[type] : undefined);
}

// Get `CMS layout` for Vanilla mobile.
export const getCmsLayoutEuropeanMobileVanilla = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_MOBILE_VANILLA),
);
export const getCmsLayoutAsianMobileVanilla = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_MOBILE_ASIAN),
);

export const getCmsLayoutMobileVanilla = createSelector(
  getCmsLayoutEuropeanMobileVanilla,
  getCmsLayoutAsianMobileVanilla,
  getAuthMobileView,
  (vanillaLayouts, asianLayouts, currentView) => {
    switch (currentView) {
      case APPLICATION_TYPE_MOBILE_VANILLA:
        return vanillaLayouts;
      case APPLICATION_TYPE_MOBILE_ASIAN:
        return asianLayouts;
      default:
        return undefined;
    }
  },
);

// Get `CMS layout` for EZ mobile.
export const getCmsLayoutMobileEZ = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_MOBILE_EZ),
);

export const getCmsLayoutCityMobile = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_MOBILE_CITY),
);

// Get `CMS layout` for Slim mobile.
export const getCmsLayoutMobileSlim = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_MOBILE_SLIM),
);

// Get `CMS layout` for European desktop.
export const getCmsLayoutEuropeanDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_EUROPEAN),
);

// Get `CMS layout` for Continental desktop.
export const getCmsLayoutContinentalDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_CONTINENTAL),
);

// Get `CMS layout` for Asian desktop.
export const getCmsLayoutAsianDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_ASIAN),
);

// Get `CMS layout` for Compact desktop.
export const getCmsLayoutCompactDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_COMPACT),
);

// Get `CMS layout` for OB desktop.
export const getCmsLayoutOBDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_OB),
);

// Get `CMS layout` for Slim desktop.
export const getCmsLayoutSlimDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_SLIM),
);

export const getCmsLayoutCityDesktop = createSelector(
  getCmsLayout,
  getCmsLayoutByLayoutViewType(CMS_LAYOUT_VIEW_TYPE_DESKTOP_CITY),
);
