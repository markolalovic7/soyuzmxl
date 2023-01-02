import cx from "classnames";
import PropsTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BET_TYPES } from "../../../../../../constants/betcalculator-bets";

import BetType from "./components/BetType";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  currencyCode: PropsTypes.string,
  odds: PropsTypes.array.isRequired,
  returns: PropsTypes.oneOfType([PropsTypes.string, PropsTypes.number]).isRequired,
};

const defaultProps = {
  currencyCode: "USD",
};

const CalculatorOverlay = ({ currencyCode, odds, returns }) => {
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={cx(classes["calculator"], { [classes["open"]]: isOpened })}>
      <div className={classes["calculator__header"]}>
        <div className={classes["calculator__title"]}>
          <span>{`${currencyCode} ${returns}`}</span>
          <span>{t("bet_calculator.your_return")}</span>
        </div>
        <span
          className={classes["calculator__arrow"]}
          id="calculator-arrow"
          onClick={() => setIsOpened((prevState) => !prevState)}
        >
          <span />
        </span>
        <span
          className={classes["calculator__arrow-2"]}
          id="calculator-arrow-2"
          onClick={() => setIsOpened((prevState) => !prevState)}
        >
          <span />
        </span>
      </div>
      <div className={cx(classes["calculator__content"], { [classes["open"]]: isOpened })}>
        <div className={classes["calculator__container"]}>
          {BET_TYPES.map((betType, index) => {
            if (betType.rowsNumber > odds.length) return null;

            return <BetType betType={betType} key={betType.value} odds={odds} />;
          })}
        </div>
      </div>
    </div>
  );
};

CalculatorOverlay.propTypes = propTypes;
CalculatorOverlay.defaultProps = defaultProps;

export default CalculatorOverlay;
