export const AFRICAN_MARKET_TYPE_1x2 = "1x2";
export const AFRICAN_MARKET_TYPE_ML = "ML";
export const AFRICAN_MARKET_TYPE_FH_1x2 = "FH_1x2";
export const AFRICAN_MARKET_TYPE_FS_ML = "FS_ML";
export const AFRICAN_MARKET_TYPE_SS_ML = "SS_ML";
export const AFRICAN_MARKET_TYPE_FH_ML = "FH_ML";
export const AFRICAN_MARKET_TYPE_HDP = "HDP";
export const AFRICAN_MARKET_TYPE_FH_HDP = "FH_HDP";
export const AFRICAN_MARKET_TYPE_FS_HDP = "FS_HDP";
export const AFRICAN_MARKET_TYPE_DC = "DC";
export const AFRICAN_MARKET_TYPE_OU = "OU";
export const AFRICAN_MARKET_TYPE_FH_OU = "FH_OU";
export const AFRICAN_MARKET_TYPE_OE = "OE";
export const AFRICAN_MARKET_TYPE_BS = "BS";
export const AFRICAN_MARKET_TYPE_OT = "OT";

export const AFRICAN_OUTCOME_TYPE_1 = "1";
export const AFRICAN_OUTCOME_TYPE_2 = "2";
export const AFRICAN_OUTCOME_TYPE_X = "X";

export const AFRICAN_OUTCOME_TYPE_YES = "Y";
export const AFRICAN_OUTCOME_TYPE_NO = "N";

export const AFRICAN_OUTCOME_TYPE_1X = "1X";
export const AFRICAN_OUTCOME_TYPE_12 = "12";
export const AFRICAN_OUTCOME_TYPE_2X = "2X";

export const AFRICAN_OUTCOME_TYPE_OVER = "O";
export const AFRICAN_OUTCOME_TYPE_UNDER = "U";
export const AFRICAN_OUTCOME_TYPE_SPREAD = "SPREAD";

export const AFRICAN_OUTCOME_TYPE_ODD = "ODD";
export const AFRICAN_OUTCOME_TYPE_EVEN = "EVEN";

export const AFRICAN_OUTCOME_TYPE_OUTCOME = "OUTCOME";
export const AFRICAN_OUTCOME_TYPE_PRICE = "PRICE";

export const AFRICAN_MARKET_CRITERIA_MAPPING = {
  // The criteria as it appears in the API market.criteria
  [AFRICAN_MARKET_TYPE_1x2]: "1X2",
  [AFRICAN_MARKET_TYPE_BS]: "BS",
  [AFRICAN_MARKET_TYPE_DC]: "DC",
  [AFRICAN_MARKET_TYPE_FH_1x2]: "FH-1X2",
  [AFRICAN_MARKET_TYPE_FH_ML]: "FH-ML",
  [AFRICAN_MARKET_TYPE_FH_OU]: "FH-OU",
  [AFRICAN_MARKET_TYPE_FS_ML]: "FS-ML",
  [AFRICAN_MARKET_TYPE_HDP]: "HDP",
  [AFRICAN_MARKET_TYPE_ML]: "ML",
  [AFRICAN_MARKET_TYPE_OE]: "OE",
  [AFRICAN_MARKET_TYPE_OT]: "OT",
  [AFRICAN_MARKET_TYPE_OU]: "OU",
  [AFRICAN_MARKET_TYPE_SS_ML]: "SS-ML",
};

export const AFRICAN_MARKET_OUTCOME_MAPPING = {
  [AFRICAN_MARKET_TYPE_1x2]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_X, AFRICAN_OUTCOME_TYPE_2],
  [AFRICAN_MARKET_TYPE_BS]: [AFRICAN_OUTCOME_TYPE_YES, AFRICAN_OUTCOME_TYPE_NO],
  [AFRICAN_MARKET_TYPE_DC]: [AFRICAN_OUTCOME_TYPE_1X, AFRICAN_OUTCOME_TYPE_12, AFRICAN_OUTCOME_TYPE_2X],
  [AFRICAN_MARKET_TYPE_FH_1x2]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_X, AFRICAN_OUTCOME_TYPE_2],
  [AFRICAN_MARKET_TYPE_FH_ML]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_2],
  [AFRICAN_MARKET_TYPE_FH_OU]: [AFRICAN_OUTCOME_TYPE_OVER, AFRICAN_OUTCOME_TYPE_UNDER, AFRICAN_OUTCOME_TYPE_SPREAD],
  [AFRICAN_MARKET_TYPE_FS_ML]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_2],
  [AFRICAN_MARKET_TYPE_HDP]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_2, AFRICAN_OUTCOME_TYPE_SPREAD],
  [AFRICAN_MARKET_TYPE_ML]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_2],
  [AFRICAN_MARKET_TYPE_OE]: [AFRICAN_OUTCOME_TYPE_ODD, AFRICAN_OUTCOME_TYPE_EVEN],
  [AFRICAN_MARKET_TYPE_OT]: [AFRICAN_OUTCOME_TYPE_OUTCOME, AFRICAN_OUTCOME_TYPE_PRICE],
  [AFRICAN_MARKET_TYPE_OU]: [AFRICAN_OUTCOME_TYPE_OVER, AFRICAN_OUTCOME_TYPE_UNDER, AFRICAN_OUTCOME_TYPE_SPREAD],
  [AFRICAN_MARKET_TYPE_SS_ML]: [AFRICAN_OUTCOME_TYPE_1, AFRICAN_OUTCOME_TYPE_2],
};

export const AFRICAN_SPORT_MARKET_MAPPING = {
  AMFB: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_FH_ML, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  AURL: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  BADM: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  BASE: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  BASK: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_FH_OU, AFRICAN_MARKET_TYPE_OE],
  BOXI: [AFRICAN_MARKET_TYPE_ML],
  COUN: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  CRIC: [AFRICAN_MARKET_TYPE_ML],
  DART: [AFRICAN_MARKET_TYPE_ML],
  DEFAULT: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  FIEL: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_OU],
  FLOO: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_OU],
  FOOT: [
    AFRICAN_MARKET_TYPE_1x2,
    AFRICAN_MARKET_TYPE_DC,
    AFRICAN_MARKET_TYPE_OU,
    AFRICAN_MARKET_TYPE_OE,
    AFRICAN_MARKET_TYPE_BS,
  ],
  FUTS: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_OU],
  GOLF: [AFRICAN_MARKET_TYPE_OT],
  HAND: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_FH_1x2, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  ICEH: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  LEAG: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  MMA: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU],
  OUTRIGHT: [AFRICAN_MARKET_TYPE_OT],
  PESA: [AFRICAN_MARKET_TYPE_1x2],
  RUGB: [AFRICAN_MARKET_TYPE_1x2, AFRICAN_MARKET_TYPE_DC, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  TABL: [AFRICAN_MARKET_TYPE_ML],
  TENN: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_FS_ML, AFRICAN_MARKET_TYPE_SS_ML],
  VOLL: [AFRICAN_MARKET_TYPE_ML, AFRICAN_MARKET_TYPE_OU, AFRICAN_MARKET_TYPE_OE],
  WATE: [AFRICAN_MARKET_TYPE_OT],
};
