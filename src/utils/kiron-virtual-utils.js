import {
  KIRON_VIRTUAL_FEED_CODE_BADM,
  KIRON_VIRTUAL_FEED_CODE_BASK,
  KIRON_VIRTUAL_FEED_CODE_CAR,
  KIRON_VIRTUAL_FEED_CODE_FFL,
  KIRON_VIRTUAL_FEED_CODE_FSM,
  KIRON_VIRTUAL_FEED_CODE_GREY,
  KIRON_VIRTUAL_FEED_CODE_HORS,
  KIRON_VIRTUAL_FEED_CODE_TABL,
} from "../constants/kiron-virtual-sport-feed-code-types";

const KR_VIRTUAL_PATH = "/krvirtual";

export const getKironSportList = (t) => [
  { code: KIRON_VIRTUAL_FEED_CODE_GREY, label: t("virtual.kiron.GREY") },
  { code: KIRON_VIRTUAL_FEED_CODE_HORS, label: t("virtual.kiron.HORS") },
  { code: KIRON_VIRTUAL_FEED_CODE_CAR, label: t("virtual.kiron.CAR") },
  { code: KIRON_VIRTUAL_FEED_CODE_BADM, label: t("virtual.kiron.BADM") },
  { code: KIRON_VIRTUAL_FEED_CODE_TABL, label: t("virtual.kiron.TABL") },
  { code: KIRON_VIRTUAL_FEED_CODE_BASK, label: t("virtual.kiron.BASK") },
  { code: KIRON_VIRTUAL_FEED_CODE_FFL, label: t("virtual.kiron.FFL") },
  { code: KIRON_VIRTUAL_FEED_CODE_FSM, label: t("virtual.kiron.FSM") },
];

export const isKrVirtualSportsLocation = (pathname) => pathname.startsWith(KR_VIRTUAL_PATH);

export const isKironGameEvent = (feedCode) =>
  [
    KIRON_VIRTUAL_FEED_CODE_BADM,
    KIRON_VIRTUAL_FEED_CODE_TABL,
    KIRON_VIRTUAL_FEED_CODE_BASK,
    KIRON_VIRTUAL_FEED_CODE_FFL,
    KIRON_VIRTUAL_FEED_CODE_FSM,
  ].includes(feedCode);

export const isKironRankEvent = (feedCode) =>
  [KIRON_VIRTUAL_FEED_CODE_GREY, KIRON_VIRTUAL_FEED_CODE_HORS, KIRON_VIRTUAL_FEED_CODE_CAR].includes(feedCode);

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
