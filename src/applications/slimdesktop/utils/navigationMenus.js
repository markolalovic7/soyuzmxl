import {
  INTERNAL_NAMED_COMPONENT_TYPE_HOME,
  INTERNAL_NAMED_COMPONENT_TYPE_LIVE,
  INTERNAL_NAMED_COMPONENT_TYPE_LIVE_CALENDAR,
  INTERNAL_NAMED_COMPONENT_TYPE_PREMATCH,
  INTERNAL_NAMED_COMPONENT_TYPE_RESULTS,
} from "constants/navigation-drawer";
import { getHrefBasePrematch, getHrefHome, getHrefLive, getHrefLiveCalendar, getHrefResults } from "utils/route-href";

export function getSlimDesktopRouteByInternalComponent(internalComponent) {
  return {
    [INTERNAL_NAMED_COMPONENT_TYPE_HOME]: getHrefHome(),
    [INTERNAL_NAMED_COMPONENT_TYPE_LIVE]: getHrefLive(),
    [INTERNAL_NAMED_COMPONENT_TYPE_LIVE_CALENDAR]: getHrefLiveCalendar(),
    [INTERNAL_NAMED_COMPONENT_TYPE_PREMATCH]: getHrefBasePrematch(),
    [INTERNAL_NAMED_COMPONENT_TYPE_RESULTS]: getHrefResults(),
  }[internalComponent];
}
