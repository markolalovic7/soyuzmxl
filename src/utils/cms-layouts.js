import {
  CMS_LAYOUT_ROUTE_BETRADAR_VIRTUAL_SPORTS,
  CMS_LAYOUT_ROUTE_CALENDAR,
  CMS_LAYOUT_ROUTE_DASHBOARD,
  CMS_LAYOUT_ROUTE_HERO_BANNER,
  CMS_LAYOUT_ROUTE_KIRON_VIRTUAL_SPORTS,
  CMS_LAYOUT_ROUTE_LIVE,
  CMS_LAYOUT_ROUTE_LIVE_EVENT_DETAIL,
  CMS_LAYOUT_ROUTE_PAGE_CONTENT,
  CMS_LAYOUT_ROUTE_PLAYER_PRIVATE_AREA,
  CMS_LAYOUT_ROUTE_PREMATCH,
  CMS_LAYOUT_ROUTE_PREMATCH_EVENT_DETAIL,
  CMS_LAYOUT_ROUTE_PREMATCH_SPECIFIC_EVENT_PATH,
  CMS_LAYOUT_ROUTE_RESULTS,
  CMS_LAYOUT_SOLID_GAMING_CASINO,
} from "constants/cms-layout-route-types";
import { matchPath } from "react-router";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternAsianSports,
  getPatternAsianSportsEventDetail,
  getPatternAsianSportsEventPathDetail,
  getPatternBetCalculator,
  getPatternBetradarVirtual,
  getPatternBetradarVirtualSport,
  getPatternChatPage,
  getPatternConfirmPasswordReset,
  getPatternContentPage,
  getPatternHeroBanner,
  getPatternHome,
  getPatternHomeSports,
  getPatternJackpot,
  getPatternJackpots,
  getPatternKiron,
  getPatternKironVirtualSport,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEvent,
  getPatternLiveEventDetail,
  getPatternLiveEventPathAndEventDetail,
  getPatternLiveEventPathDetail,
  getPatternLiveMultiview,
  getPatternLiveSportDetail,
  getPatternLiveSportsEventPath,
  getPatternLiveSportsEventPathEvent,
  getPatternMyBets,
  getPatternMyStatements,
  getPatternPrematch,
  getPatternPrematchEvent,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
  getPatternPrematchSports,
  getPatternPrematchSportsEventPath,
  getPatternPrematchSportsEventPathEvent,
  getPatternPromotions,
  getPatternRequestPasswordReset,
  getPatternResults,
  getPatternSearch,
  getPatternSearchResults,
  getPatternSolidGamingCasino,
  getPatternSports,
} from "utils/route-patterns";

import {
  getAsianDesktopRouteByInternalComponent,
  getOBRouteByInternalComponent,
  getVanillaDesktopRouteByInternalComponent,
} from "../applications/vanilladesktop/utils/navigationMenus";
import {
  APPLICATION_TYPE_ASIAN_DESKTOP,
  APPLICATION_TYPE_COMPACT_DESKTOP,
  APPLICATION_TYPE_CONTINENTAL_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
  APPLICATION_TYPE_OB_DESKTOP,
} from "../constants/application-types";
import {
  INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT,
  MENU_ITEM_TYPE_EXTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_LINK,
  MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT,
} from "../constants/navigation-drawer";

import { getRouteByInternalComponent } from "./navigation-drawer";
import { getHrefContentPage } from "./route-href";

const PATTERNS_ARRAY = [
  getPatternAccountCreate(),
  getPatternAccountEdit(),
  getPatternAccountSecurityEdit(),
  getPatternBetCalculator(),
  getPatternBetradarVirtualSport(),
  getPatternConfirmPasswordReset(),
  getPatternContentPage(),
  getPatternJackpot(),
  getPatternJackpots(),
  getPatternKironVirtualSport(),
  getPatternMyBets(),
  getPatternMyStatements(),
  getPatternHeroBanner(),
  getPatternLiveEventDetail(),
  getPatternLiveEventPathDetail(),
  getPatternLiveEventPathAndEventDetail(),
  getPatternLiveCalendar(),
  getPatternLive(),
  getPatternLiveSportsEventPathEvent(),
  getPatternLiveSportsEventPath(),
  getPatternLiveSportDetail(),
  getPatternLiveMultiview(),
  getPatternPrematch(),
  getPatternPrematchMain(),
  getPatternPrematchEvent(),
  getPatternPrematchEventDetail(),
  getPatternPrematchSports(),
  getPatternPrematchSportsEventPath(),
  getPatternPrematchSportsEventPathEvent(),
  getPatternRequestPasswordReset(),
  getPatternSearch(),
  getPatternSearchResults(),
  getPatternSolidGamingCasino(),
  getPatternSports(),
  getPatternAsianSports(),
  getPatternAsianSportsEventPathDetail(),
  getPatternAsianSportsEventDetail(),
  getPatternResults(),
  getPatternChatPage(),
  getPatternPromotions(),
  getPatternHomeSports(),
  getPatternHome(),
];

function getLayoutByType(layouts, type) {
  return layouts.find((layout) => layout.route === type);
}

export function getLayoutViewByRoute(layouts, pathname) {
  const pattern = PATTERNS_ARRAY.find((patternToFind) => matchPath(pathname, { exact: true, path: patternToFind }));
  if (!pattern) {
    return undefined;
  }
  switch (pattern) {
    case getPatternChatPage():
    case getPatternAccountCreate():
    case getPatternAccountEdit():
    case getPatternAccountSecurityEdit():
    case getPatternRequestPasswordReset():
    case getPatternConfirmPasswordReset():
    case getPatternMyBets():
    case getPatternMyStatements(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PLAYER_PRIVATE_AREA);
    }

    case getPatternPromotions():
    case getPatternBetCalculator():
    case getPatternContentPage(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PAGE_CONTENT);
    }

    case getPatternJackpot():
    case getPatternJackpots(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH);
    }

    case getPatternBetradarVirtual():
    case getPatternBetradarVirtualSport(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_BETRADAR_VIRTUAL_SPORTS);
    }

    case getPatternKiron():
    case getPatternKironVirtualSport(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_KIRON_VIRTUAL_SPORTS);
    }

    case getPatternHeroBanner(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_HERO_BANNER);
    }

    case getPatternHomeSports():
    case getPatternHome(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_DASHBOARD);
    }

    case getPatternLiveSportsEventPath():
    case getPatternLiveSportDetail():
    case getPatternLive(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_LIVE);
    }

    case getPatternLiveSportsEventPathEvent():
    case getPatternLiveMultiview():
    case getPatternLiveEvent:
    case getPatternLiveEventDetail():
    case getPatternLiveEventPathDetail():
    case getPatternLiveEventPathAndEventDetail(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_LIVE_EVENT_DETAIL);
    }

    case getPatternLiveCalendar(): {
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_CALENDAR);
    }

    case getPatternAsianSports():
    case getPatternAsianSportsEventPathDetail():
    case getPatternAsianSportsEventDetail():
    case getPatternSports():
    case getPatternPrematch():
    case getPatternPrematchMain():
    case getPatternPrematchEvent():
    case getPatternPrematchSports():
    case getPatternPrematchSportsEventPath(): {
      const { params } = matchPath(pathname, pattern);
      const layoutPrematchSpecificEventPath = layouts.find(
        (layout) =>
          layout.route === CMS_LAYOUT_ROUTE_PREMATCH_SPECIFIC_EVENT_PATH &&
          layout.eventPathIds?.includes(Number(params.eventPathId)),
      );

      return layoutPrematchSpecificEventPath ?? getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH);
    }

    case getPatternPrematchEventDetail():
    case getPatternPrematchSportsEventPathEvent():
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH_EVENT_DETAIL);

    case getPatternSearchResults():
    case getPatternSearch():
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_PREMATCH);

    case getPatternResults():
      return getLayoutByType(layouts, CMS_LAYOUT_ROUTE_RESULTS);

    case getPatternSolidGamingCasino():
      return getLayoutByType(layouts, CMS_LAYOUT_SOLID_GAMING_CASINO);

    default:
      return undefined;
  }
}

const isPatternGroupMatch = (patternGroup, menuLink, pathname) =>
  !!(
    patternGroup.find((pattern) => matchPath(menuLink, { exact: true, path: pattern })) &&
    patternGroup.find((pattern) => matchPath(pathname, { exact: true, path: pattern }))
  );

export function isMenuLinkMatch(view, navigationData, pathname) {
  const { component, link, modifiers, type, url } = navigationData;

  if (component === INTERNAL_NAMED_COMPONENT_TYPE_PAGE_CONTENT) {
    const { PAGE_CONTENT_ID } = modifiers;

    const contentPagePath = getHrefContentPage(PAGE_CONTENT_ID);

    if (contentPagePath === pathname) return true;
  } else {
    const menuLink = {
      [MENU_ITEM_TYPE_EXTERNAL_LINK]: url,
      [MENU_ITEM_TYPE_INTERNAL_LINK]: link,
      [MENU_ITEM_TYPE_INTERNAL_NAMED_COMPONENT]:
        view === APPLICATION_TYPE_ASIAN_DESKTOP
          ? getAsianDesktopRouteByInternalComponent(component)
          : [
              APPLICATION_TYPE_EUROPEAN_DESKTOP,
              APPLICATION_TYPE_COMPACT_DESKTOP,
              APPLICATION_TYPE_CONTINENTAL_DESKTOP,
            ].includes(view)
          ? getVanillaDesktopRouteByInternalComponent(component)
          : view === APPLICATION_TYPE_OB_DESKTOP
          ? getOBRouteByInternalComponent(component)
          : getRouteByInternalComponent(component),
    }[type];

    // Include here "simple" paths
    if (menuLink === pathname) return true;

    // Jackpots
    let patternGroup = [getPatternJackpot(), getPatternJackpots()];
    if (isPatternGroupMatch(patternGroup, menuLink, pathname)) return true;

    // BR Virtual Sports
    patternGroup = [getPatternBetradarVirtual(), getPatternBetradarVirtualSport()];
    if (isPatternGroupMatch(patternGroup, menuLink, pathname)) return true;

    // Kiron Virtual Sports
    patternGroup = [getPatternKiron(), getPatternKironVirtualSport()];
    if (isPatternGroupMatch(patternGroup, menuLink, pathname)) return true;

    // Live
    patternGroup = [
      getPatternLiveSportDetail(),
      getPatternLive(),
      getPatternLiveEvent(),
      getPatternLiveEventDetail(),
      getPatternLiveEventPathDetail(),
      getPatternLiveEventPathAndEventDetail(),
      getPatternLiveMultiview(),
    ];
    if (isPatternGroupMatch(patternGroup, menuLink, pathname)) return true;

    // "Sports" / Prematch
    patternGroup = [
      getPatternAsianSports(),
      getPatternAsianSportsEventPathDetail(),
      getPatternAsianSportsEventDetail(),
      getPatternSports(),
      getPatternPrematch(),
      getPatternPrematchMain(),
      getPatternPrematchEvent(),
      getPatternPrematchEventDetail(),
      getPatternSearchResults(),
      getPatternSearch(),
    ];
    if (isPatternGroupMatch(patternGroup, menuLink, pathname)) return true;
  }

  return false;
}
