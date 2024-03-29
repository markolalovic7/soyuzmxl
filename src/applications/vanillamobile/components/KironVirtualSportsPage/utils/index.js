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

export const getAPIFeedCode = (feedCode) =>
  ({
    [KIRON_VIRTUAL_FEED_CODE_BADM]: "fKRN:MEETING:KIRONVIRTUALS:BADM:BADM:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_BASK]: "fKRN:MEETING:KIRONVIRTUALS:BASK:BASK:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_CAR]: "fKRN:MEETING:KIRONVIRTUALS:MOSP:MOTO:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_FFL]: "fKRN:MEETING:KIRONVIRTUALS:FOOT:LEAGUEFOOT:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_FSM]: "fKRN:MEETING:KIRONVIRTUALS:FOOT:FOOT:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_GREY]: "fKRN:MEETING:KIRONVIRTUALS:GREY:GREY:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_HORS]: "fKRN:MEETING:KIRONVIRTUALS:HORS:DERB:ALL:ONLINE",
    [KIRON_VIRTUAL_FEED_CODE_TABL]: "fKRN:MEETING:KIRONVIRTUALS:TABL:TABL:ALL:ONLINE",
  }[feedCode] ?? "");

export const getSportCode = (feedCode) =>
  ({
    [KIRON_VIRTUAL_FEED_CODE_BADM]: "BADM",
    [KIRON_VIRTUAL_FEED_CODE_BASK]: "BASK",
    [KIRON_VIRTUAL_FEED_CODE_CAR]: "MOSP",
    [KIRON_VIRTUAL_FEED_CODE_FFL]: "FOOT",
    [KIRON_VIRTUAL_FEED_CODE_FSM]: "FOOT",
    [KIRON_VIRTUAL_FEED_CODE_GREY]: "GREY",
    [KIRON_VIRTUAL_FEED_CODE_HORS]: "HORS",
    [KIRON_VIRTUAL_FEED_CODE_TABL]: "TABL",
  }[feedCode] ?? "");
