const NAVIGATION_TABS = [
  { code: "ALL", translationKey: "all" },
  { code: "MATCH", translationKey: "match" },
  { code: "HANDICAP", translationKey: "handicap" },
  { code: "OVER_UNDER", translationKey: "over_under" },
  { code: "ODD_EVEN", translationKey: "odd_even" },
  { code: "PERIODS", translationKey: "periods" },
  { code: "OTHERS", translationKey: "others" },
];

export const getNavigationTabs = (t) =>
  NAVIGATION_TABS.map((entry) => ({
    code: entry.code,
    desc: t(entry.translationKey),
  }));
