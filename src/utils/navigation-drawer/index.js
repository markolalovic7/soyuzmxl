import {
  INTERNAL_NAMED_COMPONENT_TYPE_BET_CALCULATOR,
  INTERNAL_NAMED_COMPONENT_TYPE_HOME,
  INTERNAL_NAMED_COMPONENT_TYPE_JACKPOTS,
  INTERNAL_NAMED_COMPONENT_TYPE_LIVE,
  INTERNAL_NAMED_COMPONENT_TYPE_LIVE_CALENDAR,
  INTERNAL_NAMED_COMPONENT_TYPE_PREMATCH,
  INTERNAL_NAMED_COMPONENT_TYPE_PROMOTIONS,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
  INTERNAL_NAMED_COMPONENT_TYPE_SOLID_GAMING,
} from "constants/navigation-drawer";
import {
  getHrefResults,
  getHrefHome,
  getHrefBetCalculator,
  getHrefJackpots,
  getHrefLive,
  getHrefLiveCalendar,
  getHrefSolidGaming,
  getHrefPromotions,
} from "utils/route-href";

export function getRouteByInternalComponent(internalComponent) {
  return (
    {
      [INTERNAL_NAMED_COMPONENT_TYPE_BET_CALCULATOR]: getHrefBetCalculator(),
      [INTERNAL_NAMED_COMPONENT_TYPE_HOME]: getHrefHome(),
      [INTERNAL_NAMED_COMPONENT_TYPE_JACKPOTS]: getHrefJackpots(),
      [INTERNAL_NAMED_COMPONENT_TYPE_LIVE]: getHrefLive(),
      [INTERNAL_NAMED_COMPONENT_TYPE_LIVE_CALENDAR]: getHrefLiveCalendar(),
      // Note: For `Desktop` should be different route.
      [INTERNAL_NAMED_COMPONENT_TYPE_PREMATCH]: getHrefHome(),
      [INTERNAL_NAMED_COMPONENT_TYPE_PROMOTIONS]: getHrefPromotions(),
      [INTERNAL_NAMED_COMPONENT_TYPE_RESULTS]: getHrefResults(),
      [INTERNAL_NAMED_COMPONENT_TYPE_SOLID_GAMING]: getHrefSolidGaming(),
    }[internalComponent] ?? getHrefHome()
  );
}
