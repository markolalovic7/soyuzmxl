import {
  KIRON_VIRTUAL_FEED_CODE_BASK,
  KIRON_VIRTUAL_FEED_CODE_BADM,
  KIRON_VIRTUAL_FEED_CODE_CAR,
  KIRON_VIRTUAL_FEED_CODE_FFL,
  KIRON_VIRTUAL_FEED_CODE_FSM,
  KIRON_VIRTUAL_FEED_CODE_GREY,
  KIRON_VIRTUAL_FEED_CODE_HORS,
  KIRON_VIRTUAL_FEED_CODE_TABL,
} from "constants/kiron-virtual-sport-feed-code-types";

export const getKironFeedCodeTranslated = (feedCode, t) =>
  ({
    [KIRON_VIRTUAL_FEED_CODE_BADM]: t("kiron_virtual.feed_code_badm"),
    [KIRON_VIRTUAL_FEED_CODE_BASK]: t("kiron_virtual.feed_code_bask"),
    [KIRON_VIRTUAL_FEED_CODE_CAR]: t("kiron_virtual.feed_code_car"),
    [KIRON_VIRTUAL_FEED_CODE_FFL]: t("kiron_virtual.feed_code_ffl"),
    [KIRON_VIRTUAL_FEED_CODE_FSM]: t("kiron_virtual.feed_code_fsm"),
    [KIRON_VIRTUAL_FEED_CODE_GREY]: t("kiron_virtual.feed_code_grey"),
    [KIRON_VIRTUAL_FEED_CODE_HORS]: t("kiron_virtual.feed_code_hors"),
    [KIRON_VIRTUAL_FEED_CODE_TABL]: t("kiron_virtual.feed_code_tabl"),
  }[feedCode]);
