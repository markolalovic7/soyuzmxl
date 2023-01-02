import React from "react";

import {
  APPLICATION_TYPE_ASIAN_DESKTOP,
  APPLICATION_TYPE_CITY_DESKTOP,
  APPLICATION_TYPE_COMPACT_DESKTOP,
  APPLICATION_TYPE_CONTINENTAL_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
  APPLICATION_TYPE_EZ_DESKTOP,
  APPLICATION_TYPE_MOBILE_ASIAN,
  APPLICATION_TYPE_MOBILE_CITY,
  APPLICATION_TYPE_MOBILE_EZ,
  APPLICATION_TYPE_MOBILE_SLIM,
  APPLICATION_TYPE_MOBILE_VANILLA,
  APPLICATION_TYPE_OB_DESKTOP,
  APPLICATION_TYPE_SLIM_DESKTOP,
} from "constants/application-types";

// NOTE - do not do direct import, always lazy load - else we get conflicting css imported!

// https://reactjs.org/docs/code-splitting.html
const EZBetApp = React.lazy(() => import("../applications/ezbet/EZBetApp"));
const SlimMobileApp = React.lazy(() => import("../applications/slimmobile/SlimMobileApp"));
// const SlimDesktopApp = React.lazy(() => import("../applications/slimdesktop/SlimDesktopApp"));
const VanillaMobileApp = React.lazy(() => import("../applications/vanillamobile/VanillaMobileApp"));
const CityDesktopApp = React.lazy(() => import("../applications/citydesktop/CityDesktopApp"));
const VanillaDesktopApp = React.lazy(() => import("../applications/vanilladesktop/VanillaDesktopApp"));
const CityMobileApp = React.lazy(() => import("../applications/citymobile/CityMobileApp"));
const OllehDesktopApp = React.lazy(() => import("../applications/ollehdesktop/OllehDesktopApp"));
const SlimDesktopApp = React.lazy(() => import("../applications/slimdesktop/SlimDesktopApp"));

export function getAppMobile(mobileApplicationType) {
  return (
    {
      [APPLICATION_TYPE_MOBILE_ASIAN]: VanillaMobileApp,
      [APPLICATION_TYPE_MOBILE_CITY]: CityMobileApp,
      [APPLICATION_TYPE_MOBILE_EZ]: EZBetApp,
      [APPLICATION_TYPE_MOBILE_SLIM]: SlimMobileApp,
      [APPLICATION_TYPE_MOBILE_VANILLA]: VanillaMobileApp,
    }[mobileApplicationType] ?? SlimMobileApp
  );
}

export function getAppDesktop(mobileApplicationType) {
  return (
    {
      [APPLICATION_TYPE_ASIAN_DESKTOP]: VanillaDesktopApp,
      [APPLICATION_TYPE_CITY_DESKTOP]: CityDesktopApp,
      [APPLICATION_TYPE_COMPACT_DESKTOP]: VanillaDesktopApp,
      [APPLICATION_TYPE_CONTINENTAL_DESKTOP]: VanillaDesktopApp,
      [APPLICATION_TYPE_EUROPEAN_DESKTOP]: VanillaDesktopApp,
      [APPLICATION_TYPE_EZ_DESKTOP]: EZBetApp,
      [APPLICATION_TYPE_OB_DESKTOP]: OllehDesktopApp,
      [APPLICATION_TYPE_SLIM_DESKTOP]: SlimDesktopApp,
    }[mobileApplicationType] ?? VanillaDesktopApp
  );
}
