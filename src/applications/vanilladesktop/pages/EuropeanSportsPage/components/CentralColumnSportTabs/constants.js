// should be translation keys
const CENTRAL_COLUMN_SPORT_TABS = [
  { code: "MONEY_LINE", desc: "1 x 2", prefix: "m", translationKey: "1_x_2" },
  { code: "HANDICAP", desc: "Handicap", prefix: "s", translationKey: "handicap" },
  { code: "OVER_UNDER", desc: "Over / Under", prefix: "t", translationKey: "over_under" },
];

export const getCentralColumnSportTabs = (t) =>
  CENTRAL_COLUMN_SPORT_TABS.map((entry) => ({
    code: entry.code,
    desc: t(entry.translationKey),
    prefix: entry.prefix,
  }));
