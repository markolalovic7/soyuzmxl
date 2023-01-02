import { createSelector } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";

import {
  APPLICATION_TYPE_ASIAN_DESKTOP,
  APPLICATION_TYPE_CITY_DESKTOP,
  APPLICATION_TYPE_COMPACT_DESKTOP,
  APPLICATION_TYPE_CONTINENTAL_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
  APPLICATION_TYPE_MOBILE_SLIM,
  APPLICATION_TYPE_MOBILE_VANILLA,
  APPLICATION_TYPE_OB_DESKTOP,
  APPLICATION_TYPE_SLIM_DESKTOP,
} from "../../constants/application-types";
import { CMS_LAYOUT_WIDGET_TYPE_MATCH_TRACKER } from "../../constants/cms-layout-widget-types";
import {
  DASHBOARD_LAYOUT,
  THREE_COLUMN_LAYOUT,
  TWO_COLUMN_LEFT_NAVIGATION_LAYOUT,
  TWO_COLUMN_RIGHT_NAVIGATION_LAYOUT,
} from "../../constants/cms-template-types";

import { getCachedAssets } from "./assets-selectors";
import { getAuthDesktopView, getAuthMobileView } from "./auth-selector";
import {
  getCmsLayoutAsianDesktop,
  getCmsLayoutCityDesktop,
  getCmsLayoutCityMobile,
  getCmsLayoutCompactDesktop,
  getCmsLayoutContinentalDesktop,
  getCmsLayoutEuropeanDesktop,
  getCmsLayoutMobileEZ,
  getCmsLayoutMobileSlim,
  getCmsLayoutMobileVanilla,
  getCmsLayoutOBDesktop,
  getCmsLayoutSlimDesktop,
} from "./cms-layout-selector";

import {
  CMS_LAYOUT_ROUTE_DASHBOARD,
  CMS_LAYOUT_ROUTE_HERO_BANNER,
  CMS_LAYOUT_ROUTE_LIVE,
  CMS_LAYOUT_ROUTE_LIVE_EVENT_DETAIL,
  CMS_LAYOUT_ROUTE_PAGE_CONTENT,
  CMS_LAYOUT_ROUTE_PREMATCH,
} from "constants/cms-layout-route-types";
import {
  CMS_LAYOUT_SECTION_BETSLIP,
  CMS_LAYOUT_SECTION_CENTER_NAVIGATION_COLUMN,
  CMS_LAYOUT_SECTION_CENTER_SUBHERO_BANNER,
  CMS_LAYOUT_SECTION_FEATURED_LEAGUES,
  CMS_LAYOUT_SECTION_FOOTER_NAVIGATION_MENU,
  CMS_LAYOUT_SECTION_HEADER_HERO_BANNER,
  CMS_LAYOUT_SECTION_HEADER_NAVIGATION_MENU,
  CMS_LAYOUT_SECTION_HEADER_SPORTS_CAROUSEL,
  CMS_LAYOUT_SECTION_HERO_BANNER,
  CMS_LAYOUT_SECTION_IFRAME,
  CMS_LAYOUT_SECTION_LEFT_NAVIGATION_COLUMN,
  CMS_LAYOUT_SECTION_LEFT_NAVIGATION_DRAWER,
  CMS_LAYOUT_SECTION_LEFT_SUBHERO_BANNER,
  CMS_LAYOUT_SECTION_MATCH_TRACKER,
  CMS_LAYOUT_SECTION_RIGHT_NAVIGATION_COLUMN,
  CMS_LAYOUT_SECTION_RIGHT_SUBHERO_BANNER,
} from "constants/cms-layout-section-types";
import { getLayoutViewByRoute } from "utils/cms-layouts";
import { getSortedCarouselImages } from "utils/sort/carousel-image-sort";
import { getSortedWidgets } from "utils/sort/cms-layout-widget-sort";

// Get `LEFT_NAVIGATION_DRAWER_COLUMN` widget for route passed as argument in the function.
function getCmsLayoutWidgetsLeftNavigationDrawer(layouts, pathname) {
  if (isEmpty(layouts) || !pathname) {
    return undefined;
  }
  const layoutView = getLayoutViewByRoute(layouts, pathname);
  if (!layoutView) {
    return undefined;
  }

  return getSortedWidgets(
    layoutView.widgets.filter(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_LEFT_NAVIGATION_DRAWER,
    ),
  );
}

// Get `LEFT_NAVIGATION_DRAWER_COLUMN` for vanilla mobile.
export const getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer = createSelector(
  getCmsLayoutMobileVanilla,
  (_, location) => location.pathname,
  getCmsLayoutWidgetsLeftNavigationDrawer,
);

// Get `LEFT_NAVIGATION_DRAWER_COLUMN` for slim mobile.
export const getCmsLayoutMobileSlimWidgetsLeftNavigationDrawer = createSelector(
  getCmsLayoutMobileSlim,
  (_, location) => location.pathname,
  getCmsLayoutWidgetsLeftNavigationDrawer,
);

function getCmsLayoutByType(layouts, routeType) {
  if (isEmpty(layouts)) {
    return undefined;
  }
  const layoutView = layouts.find((layout) => layout.route === routeType);
  if (!layoutView) {
    return undefined;
  }

  return getSortedWidgets(layoutView.widgets);
}

// Get widgets for Vanilla mobile for `DASHBOARD` route.
export const getCmsLayoutMobileVanillaDashboardWidgets = createSelector(getCmsLayoutMobileVanilla, (layouts) =>
  getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_DASHBOARD),
);

// Get widgets for EZ mobile for `DASHBOARD` route.
export const getCmsLayoutMobileEZDashboardWidgets = createSelector(getCmsLayoutMobileEZ, (layouts) =>
  getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_DASHBOARD),
);

// Get widgets for Slim mobile for `DASHBOARD` route.
export const getCmsLayoutMobileSlimDashboardWidgets = createSelector(getCmsLayoutMobileSlim, (layouts) =>
  getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_DASHBOARD),
);

// Get widgets for Vanilla mobile for `PAGE_CONTENT` route.
export const getCmsLayoutMobileVanillaContentWidgets = createSelector(getCmsLayoutMobileVanilla, (layouts) =>
  getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_PAGE_CONTENT),
);

// Get `HERO_BANNER` widget with images.
function getBannerCarouselImages(widgets, cachedAssets) {
  if (isEmpty(widgets)) {
    return undefined;
  }

  const bannerWidget = widgets?.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HERO_BANNER);
  if (!bannerWidget) {
    return undefined;
  }

  return getSortedCarouselImages(
    bannerWidget?.data?.banners?.map((banner) => ({
      ...banner,
      imageAsset: cachedAssets[banner.imageAssetId],
    })),
  );
}

// Get `HERO_BANNER` widget for Vanilla mobile for `DASHBOARD` route.
export const getCmsLayoutMobileVanillaDashboardBannerCarouselImages = createSelector(
  getCmsLayoutMobileVanillaDashboardWidgets,
  getCachedAssets,
  getBannerCarouselImages,
);

// Get `HERO_BANNER` widget for Slim mobile for `DASHBOARD` route.
export const getCmsLayoutMobileSlimDashboardBannerCarouselImages = createSelector(
  getCmsLayoutMobileSlimDashboardWidgets,
  getCachedAssets,
  getBannerCarouselImages,
);

export const getCmsLayoutMobileSlimBannerCarouselImages = createSelector(
  getCmsLayoutMobileSlim,
  getCachedAssets,
  (_, location) => location.pathname,
  (layouts, cachedAssets, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const bannerWidget = layoutView.widgets?.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HERO_BANNER,
    );

    if (!bannerWidget) {
      return undefined;
    }

    return getSortedCarouselImages(
      bannerWidget?.data?.banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAssets[banner.imageAssetId],
      })),
    );
  },
);

export const getCmsLayoutMobileSlimIFrame = createSelector(
  getCmsLayoutMobileSlim,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const bannerWidget = layoutView.widgets?.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_IFRAME,
    );

    return bannerWidget;
  },
);

// Get `HERO_BANNER` widget for Vanilla mobile for `DASHBOARD` route.
export const getCmsLayoutMobileVanillaContentBannerCarouselImages = createSelector(
  getCmsLayoutMobileVanillaContentWidgets,
  getCachedAssets,
  getBannerCarouselImages,
);

// Get `HEADER_SPORTS_CAROUSEL` widget for Vanilla mobile for `DASHBOARD` route.
export const getCmsLayoutMobileVanillaDashboardWidgetSportCarousel = createSelector(
  getCmsLayoutMobileVanillaDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }

    return widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HEADER_SPORTS_CAROUSEL);
  },
);

export const getCmsLayoutMobileVanillaDashboardiFrame = createSelector(
  getCmsLayoutMobileVanillaDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }

    return widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_IFRAME);
  },
);

// Get `HEADER_SPORTS_CAROUSEL` widget for EZ mobile for `DASHBOARD` route.

export const getCmsLayoutMobileEZDashboardWidgetSportCarousel = createSelector(
  getCmsLayoutMobileEZDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }

    return widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HEADER_SPORTS_CAROUSEL);
  },
);

export const getCmsLayoutMobileEZDashboardWidgetFeaturedLeagues = createSelector(
  getCmsLayoutMobileEZDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }
    const widgetFeatureLeague = widgets.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_FEATURED_LEAGUES,
    );

    if (!widgetFeatureLeague) {
      return undefined;
    }

    return widgetFeatureLeague;
  },
);

export const getCmsLayoutMobileEZDashboardWidgetImageCarousel = createSelector(
  getCmsLayoutMobileEZDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }

    return widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HERO_BANNER);
  },
);

export const getCmsLayoutMobileEZDashboardWidgetFooterMenu = createSelector(
  getCmsLayoutMobileEZDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }

    return widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_FOOTER_NAVIGATION_MENU);
  },
);

// Get `CMS_LAYOUT_SECTION_FEATURED_LEAGUES` widget for Slim mobile for `DASHBOARD` route.
export const getCmsLayoutMobileSlimDashboardWidgetFeaturedLeagues = createSelector(
  getCmsLayoutMobileSlimDashboardWidgets,
  (widgets) => {
    if (isEmpty(widgets)) {
      return undefined;
    }
    const widgetFeatureLeague = widgets.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_FEATURED_LEAGUES,
    );

    if (!widgetFeatureLeague) {
      return undefined;
    }

    return widgetFeatureLeague;
  },
);

// Get `CMS_LAYOUT_SECTION_HEADER_NAVIGATION_MENU` widget for Slim mobile.
export const getCmsLayoutMobileSlimWidgetHeaderNavigationMenu = createSelector(
  getCmsLayoutMobileSlim,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    return layoutView.widgets.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HEADER_NAVIGATION_MENU,
    );
  },
);

export const getCmsLayoutMobileSlimLiveWidgetMatchTracker = createSelector(getCmsLayoutMobileSlim, (layouts) => {
  if (isEmpty(layouts)) {
    return undefined;
  }
  const layoutView = layouts.find((layout) => layout.route === CMS_LAYOUT_ROUTE_LIVE);
  if (!layoutView) {
    return undefined;
  }

  return layoutView.widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_MATCH_TRACKER);
});

export const getCmsLayoutMobileVanillaLiveWidgetMatchTracker = createSelector(getCmsLayoutMobileVanilla, (layouts) => {
  if (isEmpty(layouts)) {
    return undefined;
  }
  const layoutView = layouts.find((layout) => layout.route === CMS_LAYOUT_ROUTE_LIVE_EVENT_DETAIL);
  if (!layoutView) {
    return undefined;
  }

  return layoutView.widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_MATCH_TRACKER);
});

function getCmsLayoutBetslipWidgets(layouts, pathname) {
  if (isEmpty(layouts) || !pathname) {
    return undefined;
  }
  const layoutView = getLayoutViewByRoute(layouts, pathname);
  if (!layoutView) {
    return undefined;
  }

  return layoutView.widgets.filter((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_BETSLIP);
}

export const getCmsLayoutMobileVanillaBetslipWidget = createSelector(
  getCmsLayoutMobileVanilla,
  (_, location) => location.pathname,
  (layout, pathname) => {
    const widgets = getCmsLayoutBetslipWidgets(layout, pathname);
    if (widgets?.length > 0) {
      return widgets[0];
    }

    return undefined;
  },
);

export const getCmsLayoutMobileSlimBetslipWidget = createSelector(
  getCmsLayoutMobileSlim,
  (_, location) => location.pathname,
  (layout, pathname) => {
    const widgets = getCmsLayoutBetslipWidgets(layout, pathname);
    if (widgets?.length > 0) {
      return widgets[0];
    }

    return undefined;
  },
);

function getCmsLayoutWidgetsLeftColumn(layouts, pathname) {
  if (isEmpty(layouts) || !pathname) {
    return undefined;
  }
  const layoutView = getLayoutViewByRoute(layouts, pathname);
  if (!layoutView) {
    return undefined;
  }

  return getSortedWidgets(
    layoutView.widgets.filter(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_LEFT_NAVIGATION_COLUMN,
    ),
  );
}
function getCmsLayoutWidgetsRightColumn(layouts, pathname) {
  if (isEmpty(layouts) || !pathname) {
    return undefined;
  }
  const layoutView = getLayoutViewByRoute(layouts, pathname);
  if (!layoutView) {
    return undefined;
  }

  return getSortedWidgets(
    layoutView.widgets.filter(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_RIGHT_NAVIGATION_COLUMN,
    ),
  );
}

function getCmsLayoutWidgetsTopCentralColumn(layouts, pathname) {
  if (isEmpty(layouts) || !pathname) {
    return undefined;
  }
  const layoutView = getLayoutViewByRoute(layouts, pathname);
  if (!layoutView) {
    return undefined;
  }

  return getSortedWidgets(
    layoutView.widgets.filter(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_CENTER_NAVIGATION_COLUMN,
    ),
  );
}
export const getCmsLayoutDesktopWidgets = createSelector(
  getCmsLayoutAsianDesktop,
  getCmsLayoutContinentalDesktop,
  getCmsLayoutCompactDesktop,
  getCmsLayoutEuropeanDesktop,
  getCmsLayoutOBDesktop,
  getCmsLayoutSlimDesktop,
  getCmsLayoutCityDesktop,
  getAuthDesktopView,
  (
    asianLayouts,
    continentalLayouts,
    compactLayouts,
    europeanLayouts,
    obLayouts,
    slimLayouts,
    cityLayouts,
    currentView,
  ) => {
    let layouts;
    switch (currentView) {
      case APPLICATION_TYPE_EUROPEAN_DESKTOP:
        layouts = europeanLayouts;
        break;
      case APPLICATION_TYPE_CONTINENTAL_DESKTOP:
        layouts = continentalLayouts;
        break;
      case APPLICATION_TYPE_ASIAN_DESKTOP:
        layouts = asianLayouts;
        break;
      case APPLICATION_TYPE_COMPACT_DESKTOP:
        layouts = compactLayouts;
        break;
      case APPLICATION_TYPE_OB_DESKTOP:
        layouts = obLayouts;
        break;
      case APPLICATION_TYPE_SLIM_DESKTOP:
        layouts = slimLayouts;
        break;
      case APPLICATION_TYPE_CITY_DESKTOP:
        layouts = cityLayouts;
        break;
      default:
        layouts = [];
    }

    return layouts;
  },
);

export const getCmsLayoutDesktopWidgetsLeftColumn = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    return getCmsLayoutWidgetsLeftColumn(layouts, pathname);
  },
);

export const getCmsLayoutDesktopWidgetsRightColumn = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    return getCmsLayoutWidgetsRightColumn(layouts, pathname);
  },
);

export const getCmsLayoutDesktopWidgetsTopCentralColumn = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    return getCmsLayoutWidgetsTopCentralColumn(layouts, pathname);
  },
);

function getDesktopRightColumnFirstMatchTracker(widgets) {
  if (isEmpty(widgets)) {
    return undefined;
  }

  return widgets.find((widget) => widget.cmsWidgetType === CMS_LAYOUT_WIDGET_TYPE_MATCH_TRACKER);
}

export const getCmsLayoutEuropeanDesktopRightColumnFirstMatchTracker = createSelector(
  getCmsLayoutDesktopWidgetsRightColumn,
  getDesktopRightColumnFirstMatchTracker,
);

export const getCmsLayoutCompactDesktopRightColumnFirstMatchTracker = createSelector(
  getCmsLayoutDesktopWidgetsRightColumn,
  getDesktopRightColumnFirstMatchTracker,
);

export const getCmsLayoutContinentalDesktopRightColumnFirstMatchTracker = createSelector(
  getCmsLayoutDesktopWidgetsRightColumn,
  getDesktopRightColumnFirstMatchTracker,
);

export const getCmsLayoutAsianDesktopRightColumnFirstMatchTracker = createSelector(
  getCmsLayoutDesktopWidgetsRightColumn,
  getDesktopRightColumnFirstMatchTracker,
);

export const getCmsLayoutDesktopLiveWidgetScoreboardMatchTracker = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    return layoutView.widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_MATCH_TRACKER);
  },
);

// Get `HEADER_HERO_BANNER` widget for Slim mobile.
export const getCmsLayoutMobileSlimWidgetHeaderHeroBanner = createSelector(
  getCmsLayoutMobileSlim,
  getCachedAssets,
  (_, location) => location.pathname,
  (layouts, cachedAsses, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const bannerWidget = layoutView.widgets.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HEADER_HERO_BANNER,
    );

    return getSortedCarouselImages(
      bannerWidget?.data?.banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAsses[banner.imageAssetId],
      })),
    );
  },
);

// Get `HEADER_HERO_BANNER` widget for  desktop.
export const getCmsLayoutDesktopWidgetHeaderHeroBanner = createSelector(
  getCmsLayoutDesktopWidgets,
  getCachedAssets,
  (_, location) => location.pathname,
  (layouts, cachedAsses, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return undefined;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const bannerWidget = layoutView.widgets.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HEADER_HERO_BANNER,
    );

    return getSortedCarouselImages(
      bannerWidget?.data?.banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAsses[banner.imageAssetId],
      })),
    );
  },
);
export const getCmsLayoutCompactDesktopLiveWidgetScoreboardMatchTracker = createSelector(
  getCmsLayoutCompactDesktop,
  (layouts) => {
    if (isEmpty(layouts)) {
      return undefined;
    }
    const layoutView = layouts.find((layout) => layout.route === CMS_LAYOUT_ROUTE_LIVE_EVENT_DETAIL);
    if (!layoutView) {
      return undefined;
    }

    return layoutView.widgets.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_MATCH_TRACKER);
  },
);

export const isDesktopCompactBetslip = createSelector(getCmsLayoutDesktopWidgets, (layouts) => {
  if (isEmpty(layouts)) {
    return undefined;
  }

  // If any route for this view uses a compact betslip, force the app into compact mode
  const compactMode =
    layouts.findIndex(
      (layout) =>
        layout.widgets.findIndex(
          (w) => w.enabled && w.cmsWidgetType === "BETSLIP" && w.data.betslipMode === "COMPACT",
        ) > -1,
    ) > -1;

  return compactMode;
});

export const isMobileCompactBetslip = createSelector(
  getCmsLayoutMobileVanilla,
  getCmsLayoutMobileSlim,
  getAuthMobileView,
  (vanillaMobileLayouts, slimMobileLayouts, currentView) => {
    let layouts;
    switch (currentView) {
      case APPLICATION_TYPE_MOBILE_VANILLA:
        layouts = vanillaMobileLayouts;
        break;
      case APPLICATION_TYPE_MOBILE_SLIM:
        layouts = slimMobileLayouts;
        break;
      default:
        layouts = [];
    }

    if (isEmpty(layouts)) {
      return undefined;
    }

    // If any route for this view uses a compact betslip, force the app into compact mode
    const compactMode =
      layouts.findIndex(
        (layout) =>
          layout.widgets.findIndex(
            (w) => w.enabled && w.cmsWidgetType === "BETSLIP" && w.data?.betslipMode === "COMPACT",
          ) > -1,
      ) > -1;

    return compactMode;
  },
);

export const getMobileBetslipMaxSelections = createSelector(
  getCmsLayoutMobileVanilla,
  getCmsLayoutMobileSlim,
  getAuthMobileView,
  (vanillaMobileLayouts, slimMobileLayouts, currentView) => {
    let layouts;
    switch (currentView) {
      case APPLICATION_TYPE_MOBILE_VANILLA:
        layouts = vanillaMobileLayouts;
        break;
      case APPLICATION_TYPE_MOBILE_SLIM:
        layouts = slimMobileLayouts;
        break;
      default:
        layouts = [];
    }

    if (isEmpty(layouts)) {
      return undefined;
    }

    // Find the largest betslip "max selections" setting for this view
    let maxSelections = 0;
    layouts.forEach((layout) => {
      layout.widgets.forEach((widget) => {
        if (widget.enabled && widget.cmsWidgetType === "BETSLIP" && widget.data.maxSelections > maxSelections) {
          maxSelections = widget.data.maxSelections;
        }
      });
    });

    return maxSelections;
  },
);

export const getDesktopBetslipMaxSelections = createSelector(getCmsLayoutDesktopWidgets, (layouts) => {
  if (isEmpty(layouts)) {
    return undefined;
  }

  // Find the largest betslip "max selections" setting for this view
  let maxSelections = 0;
  layouts.forEach((layout) => {
    layout.widgets.forEach((widget) => {
      if (widget.enabled && widget.cmsWidgetType === "BETSLIP" && widget.data.maxSelections > maxSelections) {
        maxSelections = widget.data.maxSelections;
      }
    });
  });

  return maxSelections;
});

export const getCmsLayoutDesktopHeaderMenuWidget = createSelector(
  getCmsLayoutDesktopWidgets,

  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const widgets = layoutView.widgets.filter(
      (widget) =>
        widget.enabled &&
        widget.section === CMS_LAYOUT_SECTION_HEADER_NAVIGATION_MENU &&
        widget.cmsWidgetType === "MENUS",
    );

    if (widgets.length > 0) {
      return widgets[0].data;
    }

    return undefined;
  },
);

export const getCmsLayoutVanillaDesktopFooterMenuWidget = createSelector(
  getCmsLayoutDesktopWidgets,

  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return undefined;
    }

    const widgets = layoutView.widgets.filter(
      (widget) =>
        widget.enabled &&
        widget.section === CMS_LAYOUT_SECTION_FOOTER_NAVIGATION_MENU &&
        widget.cmsWidgetType === "MENUS",
    );

    if (widgets.length > 0) {
      return widgets[0].data;
    }

    return undefined;
  },
);

export const getCmsLayoutCityDesktopDashboardCarouselImages = createSelector(
  getCmsLayoutCityDesktop,

  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH);

    const bannerWidget = widgets?.find((widget) => widget.enabled && widget.cmsWidgetType === "CAROUSEL_BANNER");
    if (!bannerWidget) {
      return undefined;
    }

    const banners = bannerWidget?.data?.banners?.filter(
      (v, i, a) => a.findIndex((t) => t.imageAssetId === v.imageAssetId) === i,
    );

    return getSortedCarouselImages(
      banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAssets[banner.imageAssetId],
      })),
    );
  },
);

export const getCmsLayoutCityMobileDashboardCarouselImages = createSelector(
  getCmsLayoutCityMobile,

  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH);

    const bannerWidget = widgets?.find((widget) => widget.enabled && widget.cmsWidgetType === "CAROUSEL_BANNER");
    if (!bannerWidget) {
      return undefined;
    }

    const banners = bannerWidget?.data?.banners?.filter(
      (v, i, a) => a.findIndex((t) => t.imageAssetId === v.imageAssetId) === i,
    );

    return getSortedCarouselImages(
      banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAssets[banner.imageAssetId],
      })),
    );
  },
);

export const getCmsLayoutVanillaDesktopDashboardHeroBannerImages = createSelector(
  getCmsLayoutDesktopWidgets,

  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_HERO_BANNER);

    const bannerWidget = widgets?.find((widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_HERO_BANNER);
    if (!bannerWidget) {
      return undefined;
    }

    const banners = bannerWidget?.data?.banners?.filter(
      (v, i, a) => a.findIndex((t) => t.imageAssetId === v.imageAssetId) === i,
    );

    return getSortedCarouselImages(
      banners?.map((banner) => ({
        ...banner,
        imageAsset: cachedAssets[banner.imageAssetId],
      })),
    );
  },
);

export const getCmsLayoutVanillaDesktopDashboardLeftSubHeroBannerImage = createSelector(
  getCmsLayoutDesktopWidgets,
  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_HERO_BANNER);

    const bannerWidget = widgets?.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_LEFT_SUBHERO_BANNER,
    );
    if (!bannerWidget) {
      return undefined;
    }

    return { ...bannerWidget.data, imageAsset: cachedAssets[bannerWidget.data.imageAssetId] };
  },
);

export const getCmsLayoutVanillaDesktopDashboardCenterSubHeroBannerImage = createSelector(
  getCmsLayoutDesktopWidgets,

  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_HERO_BANNER);

    const bannerWidget = widgets?.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_CENTER_SUBHERO_BANNER,
    );
    if (!bannerWidget) {
      return undefined;
    }

    return { ...bannerWidget.data, imageAsset: cachedAssets[bannerWidget.data.imageAssetId] };
  },
);

export const getCmsLayoutVanillaDesktopDashboardRightSubHeroBannerImage = createSelector(
  getCmsLayoutDesktopWidgets,

  getCachedAssets,
  (layouts, cachedAssets) => {
    if (isEmpty(layouts)) {
      return undefined;
    }

    const widgets = getCmsLayoutByType(layouts, CMS_LAYOUT_ROUTE_HERO_BANNER);

    const bannerWidget = widgets?.find(
      (widget) => widget.enabled && widget.section === CMS_LAYOUT_SECTION_RIGHT_SUBHERO_BANNER,
    );
    if (!bannerWidget) {
      return undefined;
    }

    return { ...bannerWidget.data, imageAsset: cachedAssets[bannerWidget.data.imageAssetId] };
  },
);

export const hasDesktopLeftColumn = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return false;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return false;
    }

    return (
      [THREE_COLUMN_LAYOUT, TWO_COLUMN_LEFT_NAVIGATION_LAYOUT, DASHBOARD_LAYOUT].findIndex((layoutTemplate) =>
        layoutView.layoutTemplate.endsWith(layoutTemplate),
      ) > -1
    );
  },
);

export const hasDesktopRightColumn = createSelector(
  getCmsLayoutDesktopWidgets,
  (_, location) => location.pathname,
  (layouts, pathname) => {
    if (isEmpty(layouts) || !pathname) {
      return false;
    }
    const layoutView = getLayoutViewByRoute(layouts, pathname);
    if (!layoutView) {
      return false;
    }

    return (
      [THREE_COLUMN_LAYOUT, TWO_COLUMN_RIGHT_NAVIGATION_LAYOUT, DASHBOARD_LAYOUT].findIndex((layoutTemplate) =>
        layoutView.layoutTemplate.endsWith(layoutTemplate),
      ) > -1
    );
  },
);
