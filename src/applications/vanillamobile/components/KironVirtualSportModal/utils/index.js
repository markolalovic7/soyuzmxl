import {
  KIRON_VIRTUAL_FEED_CODE_BADM,
  KIRON_VIRTUAL_FEED_CODE_BASK,
  KIRON_VIRTUAL_FEED_CODE_CAR,
  KIRON_VIRTUAL_FEED_CODE_FFL,
  KIRON_VIRTUAL_FEED_CODE_FSM,
  KIRON_VIRTUAL_FEED_CODE_GREY,
  KIRON_VIRTUAL_FEED_CODE_HORS,
  KIRON_VIRTUAL_FEED_CODE_TABL,
} from "constants/kiron-virtual-sport-feed-code-types";
import { getDatejsObject } from "utils/dayjs";
import { formatDateMonthYearShortDayHour } from "utils/dayjs-format";

export function formatSportResultTime(date) {
  const dateObject = getDatejsObject(date);

  return dateObject && formatDateMonthYearShortDayHour(dateObject);
}

// Note: Get `feedCode` to fetch
export const getFeedCodeWithAllOnlinePrefix = (feedCode) =>
  ({
    [KIRON_VIRTUAL_FEED_CODE_BADM]: "BADM:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_BASK]: "BASK:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_CAR]: "MOTO:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_FFL]: "LEAGUEFOOT:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_FSM]: "FOOT:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_GREY]: "GREY:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_HORS]: "DERB:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_TABL]: "TABL:ALL:ONLINE",
  }[feedCode]);
