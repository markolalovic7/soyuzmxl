import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../scss/vanilladesktop.module.scss";
import { getNavigationTabs } from "../live-utils";

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

const NavigationTabs = ({
  hasHandicap,
  hasMoneyLine,
  hasOddEven,
  hasOther,
  hasOverUnder,
  hasPeriod,
  selectedSorting,
  setSelectedSorting,
}) => {
  const { t } = useTranslation();

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);

  return (
    <div className={classes["navigation-tabs"]}>
      {navigationTabs.map((tab, index) => (
        <div
          className={cx(
            classes["navigation-tab"],
            { [classes["active"]]: tab.code === selectedSorting },
            {
              [classes["disabled"]]: !isEnabled(
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
          onClick={() => setSelectedSorting(tab.code)}
        >
          {tab.desc}
        </div>
      ))}
    </div>
  );
};

const propTypes = {
  hasHandicap: PropTypes.bool.isRequired,
  hasMoneyLine: PropTypes.bool.isRequired,
  hasOddEven: PropTypes.bool.isRequired,
  hasOther: PropTypes.bool.isRequired,
  hasOverUnder: PropTypes.bool.isRequired,
  hasPeriod: PropTypes.bool.isRequired,
  selectedSorting: PropTypes.string.isRequired,
  setSelectedSorting: PropTypes.func.isRequired,
};

NavigationTabs.propTypes = propTypes;

export default NavigationTabs;
