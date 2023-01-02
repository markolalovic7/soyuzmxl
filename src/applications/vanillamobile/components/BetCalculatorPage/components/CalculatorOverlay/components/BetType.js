import PropsTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getLocaleFormattedNumber, getValidatedFloatValue } from "../../../../../../../utils/betcalculator";
import classes from "../../../../../scss/vanillamobilestyle.module.scss";

const betlib = require("betlib-master/dist/betlib");

const BetType = ({ betType, odds }) => {
  const { t } = useTranslation();

  const [stake, setStake] = useState(100);

  const currencyCode = useSelector((state) => state.auth?.currencyCode);

  const selections = odds.map((odd) => {
    if (odd.result === "win") {
      return new betlib.WinSelection({ winOdds: parseFloat(odd.rate) });
    }
    if (odd.result === "lose") {
      return new betlib.LoseSelection();
    }

    return new betlib.VoidSelection();
  });
  const bet = new betlib.Bet(betType.value, stake, false);
  const returns = bet.settle(selections);
  const betReturns = returns?.betReturns;
  const returnsSum = Array.isArray(betReturns) ? betReturns.reduce((sum, value) => sum + value, 0) : betReturns;

  const handleStakeChange = (e) => {
    const value = getValidatedFloatValue(e.target.value);
    if (value !== null) {
      setStake(value);
    }
  };

  return (
    <div className={classes["calculator-item"]}>
      <div className={classes["calculator-item__header"]}>
        <div className={classes["calculator-item__container"]}>
          <span className={classes["calculator-item__label"]}>
            {`${t(`bet_types_options.${betType.label}.name`)} (${returns.numberOfBets()})`}
          </span>
        </div>
      </div>
      <div className={classes["calculator-item__body"]}>
        <div className={classes["calculator-item__container"]}>
          <div className={classes["calculator-item__row"]}>
            <span className={classes["calculator-item__label"]}>{t("betslip_panel.stake")}</span>
            <span className={classes["calculator-item__input"]}>
              <button type="button" onClick={() => setStake(0)}>
                {t("betslip_panel.clear")}
              </button>
              <input type="text" value={stake} onChange={handleStakeChange} />
            </span>
          </div>
          <div className={classes["calculator-item__row"]}>
            <span className={classes["calculator-item__label"]}>{t("bet_calculator.total_stake")}</span>
            <span className={classes["calculator-item__money"]}>
              {`${currencyCode} ${getLocaleFormattedNumber(returns.totalStake())}`}
            </span>
          </div>
          <div className={classes["calculator-item__row"]}>
            <span className={classes["calculator-item__label"]}>{t("betslip_panel.potential_returns")}</span>
            <span className={classes["calculator-item__money"]}>
              {`${currencyCode} ${getLocaleFormattedNumber(returnsSum)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  betType: PropsTypes.object.isRequired,
  odds: PropsTypes.array.isRequired,
};

BetType.propTypes = propTypes;

export default BetType;
