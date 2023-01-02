/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import {
  getCmsLayoutMobileVanillaDashboardBannerCarouselImages,
  getCmsLayoutMobileVanillaDashboardWidgets,
  getCmsLayoutMobileVanillaDashboardWidgetSportCarousel,
  getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer,
} from "redux/reselect/cms-layout-widgets";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer", () => {
    it("should return `layouts` for `vanilla` from store", () => {
      expect(
        getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer(
          {
            auth: {
              mobileView: "VANILLA",
            },
            cms: {
              config: {
                layouts: {
                  MOBILE_VANILLA_VIEW: [
                    {
                      route: "DASHBOARD",
                      widgets: [
                        {
                          enabled: true,
                          id: 1,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                        {
                          enabled: true,
                          id: 2,
                          section: "HERO_BANNER",
                        },
                        {
                          enabled: false,
                          id: 3,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
          { pathname: "/" },
        ),
      ).is.deep.equal([
        {
          enabled: true,
          id: 1,
          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
        },
      ]);
    });
    it("should return `undefined` when `layouts` is `undefined`", () => {
      expect(
        getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer(
          {
            cms: {
              config: {
                layouts: undefined,
              },
            },
          },
          { pathname: "/" },
        ),
      ).is.undefined;
    });
    it("should return `undefined` when `pathname` is `undefined`", () => {
      expect(
        getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer(
          {
            cms: {
              config: {
                layouts: {
                  MOBILE_VANILLA_VIEW: [
                    {
                      route: "DASHBOARD",
                      widgets: [
                        {
                          enabled: true,
                          id: 1,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                        {
                          enabled: true,
                          id: 2,
                          section: "HERO_BANNER",
                        },
                        {
                          enabled: false,
                          id: 3,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
          { pathname: undefined },
        ),
      ).is.undefined;
    });
    it("should return `undefined` when `layoutView` is not found", () => {
      expect(
        getCmsLayoutMobileVanillaWidgetsLeftNavigationDrawer(
          {
            cms: {
              config: {
                layouts: {
                  MOBILE_VANILLA_VIEW_1: [
                    {
                      route: "DASHBOARD",
                      widgets: [
                        {
                          enabled: true,
                          id: 1,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                        {
                          enabled: true,
                          id: 2,
                          section: "HERO_BANNER",
                        },
                        {
                          enabled: false,
                          id: 3,
                          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
          { pathname: "/" },
        ),
      ).is.undefined;
    });
  });
  describe("getCmsLayoutMobileVanillaDashboardWidgets", () => {
    it("should return `widgets` for `DASHBOARD` route from store", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgets({
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                      {
                        enabled: true,
                        id: 2,
                        section: "HERO_BANNER",
                      },
                      {
                        enabled: false,
                        id: 3,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.deep.equal([
        {
          enabled: true,
          id: 1,
          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
        },
        {
          enabled: true,
          id: 2,
          section: "HERO_BANNER",
        },
        {
          enabled: false,
          id: 3,
          section: "LEFT_NAVIGATION_DRAWER_COLUMN",
        },
      ]);
    });
    it("should return `undefined` when `layouts` is `undefined`", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgets({
          cms: {
            config: {
              layouts: undefined,
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `layoutView` is not found", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgets({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW_1: [
                  {
                    route: "DASHBOARD-1",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                      {
                        enabled: true,
                        id: 2,
                        section: "HERO_BANNER",
                      },
                      {
                        enabled: false,
                        id: 3,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
  });
  describe("getCmsLayoutMobileVanillaDashboardWidgetSportCarousel", () => {
    it("should return `HEADER_SPORTS_CAROUSEL` widget for `DASHBOARD` route from store", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgetSportCarousel({
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                      {
                        enabled: true,
                        id: 2,
                        section: "HEADER_SPORTS_CAROUSEL",
                      },
                      {
                        enabled: false,
                        id: 3,
                        section: "HEADER_SPORTS_CAROUSEL",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.deep.equal({
        enabled: true,
        id: 2,
        section: "HEADER_SPORTS_CAROUSEL",
      });
    });
    it("should return `undefined` when widget`s `enabled is false", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgetSportCarousel({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                      {
                        enabled: false,
                        id: 3,
                        section: "HEADER_SPORTS_CAROUSEL",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `widget` is not found", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardWidgetSportCarousel({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW_1: [
                  {
                    route: "DASHBOARD-1",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
  });
  describe("getCmsLayoutMobileVanillaDashboardBannerCarouselImages", () => {
    it("should return `undefined` when `layouts` is empty", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          cms: {
            config: {
              layouts: {},
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `DASHBOARD` route is not found", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD-1",
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `DASHBOARD` widgets are not found", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `HERO_BANNER` widget is not found", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        enabled: true,
                        id: 1,
                        section: "LEFT_NAVIGATION_DRAWER_COLUMN",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `undefined` when `HERO_BANNER` widget is disabled", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        enabled: false,
                        id: 1,
                        section: "HERO_BANNER",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.undefined;
    });
    it("should return `banners` array when `HERO_BANNER` widget is in store", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        data: {
                          banners: [
                            {
                              id: 1,
                              imageAssetId: 1,
                            },
                            {
                              id: 2,
                              imageAssetId: 2,
                            },
                          ],
                        },
                        enabled: true,
                        id: 1,
                        section: "HERO_BANNER",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.deep.equal([
        {
          id: 1,
          imageAsset: undefined,
          imageAssetId: 1,
        },
        {
          id: 2,
          imageAsset: undefined,
          imageAssetId: 2,
        },
      ]);
    });
    it("should return `banners` with images from `cachedAssets` when `HERO_BANNER` widget is in store", () => {
      expect(
        getCmsLayoutMobileVanillaDashboardBannerCarouselImages({
          asset: {
            cachedAssets: {
              1: "image-1",
              2: "image-2",
            },
          },
          auth: {
            mobileView: "VANILLA",
          },
          cms: {
            config: {
              layouts: {
                MOBILE_VANILLA_VIEW: [
                  {
                    route: "DASHBOARD",
                    widgets: [
                      {
                        data: {
                          banners: [
                            {
                              id: 1,
                              imageAssetId: 1,
                            },
                            {
                              id: 2,
                              imageAssetId: 2,
                            },
                          ],
                        },
                        enabled: true,
                        id: 1,
                        section: "HERO_BANNER",
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
      ).is.deep.equal([
        {
          id: 1,
          imageAsset: "image-1",
          imageAssetId: 1,
        },
        {
          id: 2,
          imageAsset: "image-2",
          imageAssetId: 2,
        },
      ]);
    });
  });
});
