import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getNavigationTabs } from "./constants";

function isEnabled(code, hasMoneyLine, hasOverUnder, hasHandicap, hasOddEven, hasPeriod, hasOther) {
  switch (code) {
    case "ALL":
      return true;
    case "MATCH":
      return hasMoneyLine;
    case "HANDICAP":
      return hasHandicap;
    case "OVER_UNDER":
      return hasOverUnder;
    case "ODD_EVEN":
      return hasOddEven;
    case "PERIODS":
      return hasPeriod;
    case "OTHERS":
      return hasOther;
    default:
      return false;
  }
}

const PrematchNavigationTabs = ({ markets, selectedMarketTypeGroupTab, setSelectedMarketTypeGroupTab }) => {
  const { t } = useTranslation();

  const moneyLineCount = useMemo(
    () =>
      markets.filter(
        (market) =>
          market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ).length,
    [markets],
  );

  const hasMoneyLine = moneyLineCount > 0;

  const overUnderCount = useMemo(
    () =>
      markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ).length,
    [markets],
  );

  const hasOverUnder = overUnderCount > 0;

  const handicapCount = useMemo(
    () =>
      markets.filter(
        (market) =>
          (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
          (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ).length,
    [markets],
  );

  const hasHandicap = handicapCount > 0;

  const oddEvenCount = useMemo(
    () =>
      markets.filter(
        (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
      ).length,
    [markets],
  );

  const hasOddEven = oddEvenCount > 0;

  const periodCount = useMemo(
    () => markets.filter((market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT").length,
    [markets],
  );

  const hasPeriod = periodCount > 0;

  const hasOther = markets.length - moneyLineCount - overUnderCount - handicapCount - oddEvenCount - periodCount > 0;

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  return (
    <div
      className={cx(classes["content-tabs_special"], classes["content-tabs-controls"], classes["content-tabs_special"])}
    >
      {navigationTabs.map((tab, index) => (
        <div
          className={cx(
            classes["content-tabs__controls-link"],
            classes["content-tabs-controls__link"],
            { [classes["content-tabs-controls__link_active"]]: tab.code === selectedMarketTypeGroupTab },
            {
              [classes["content-tabs-controls__link_disabled"]]: !isEnabled(
                tab.code,
                hasMoneyLine,
                hasOverUnder,
                hasHandicap,
                hasOddEven,
                hasPeriod,
                hasOther,
              ),
            },
          )}
          key={index}
          onClick={() => setSelectedMarketTypeGroupTab(tab.code)}
        >
          {tab.desc}
        </div>
      ))}
    </div>
  );
};

const propTypes = {
  markets: PropTypes.array.isRequired,
  selectedMarketTypeGroupTab: PropTypes.string.isRequired,
  setSelectedMarketTypeGroupTab: PropTypes.func.isRequired,
};

PrematchNavigationTabs.propTypes = propTypes;

export default PrematchNavigationTabs;
